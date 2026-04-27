#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { searchFunds, listCategories, listAmcs, listFundsInCategory } from './tools/search.js'
import { getFund, getNavHistory, getLatestNav, getTrailingReturns } from './tools/fund.js'
import { getMetrics, getCategoryStats, compareFunds } from './tools/metrics.js'
import { screenFunds } from './tools/screen.js'
import { getHoldings, findFundsHolding } from './tools/holdings.js'
import { getBenchmark } from './tools/benchmark.js'
import { listSifStrategies, getSifMetrics } from './tools/sif.js'

const TOOLS = [
  {
    name: 'search_funds',
    description: 'Search mutual funds by name keyword. Optionally filter by SEBI category or AMC.',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query — fund name or partial name',
        },
        category: {
          type: 'string',
          description: 'Filter by SEBI fund category (optional)',
        },
        amc: {
          type: 'string',
          description: 'Filter by AMC name (optional)',
        },
        include_sif: {
          type: 'boolean',
          description: 'Include SIF strategies in results (default: false)',
          default: false,
        },
        limit: {
          type: 'number',
          description: 'Max results to return (default: 10, max: 50)',
          default: 10,
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'list_categories',
    description: 'List all SEBI mutual fund categories with fund count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_amcs',
    description: 'List all AMCs (Asset Management Companies) with fund count, sorted alphabetically.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_funds_in_category',
    description: 'List all funds in a SEBI category, ranked by a chosen metric.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Exact fund_type / SEBI category value',
        },
        sort_by: {
          type: 'string',
          enum: ['return_1y', 'return_3y', 'return_5y', 'sharpe', 'sortino', 'max_drawdown', 'alpha'],
          description: 'Metric to sort by (default: return_1y)',
          default: 'return_1y',
        },
        limit: {
          type: 'number',
          description: 'Max results (default: 20, max: 100)',
          default: 20,
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_fund',
    description: 'Get full details for a fund: info, TER, minimum investment, launch date.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'get_nav_history',
    description: 'Get NAV history for a fund, optionally filtered by date range.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
        from_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format (optional)',
        },
        to_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (optional)',
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'get_latest_nav',
    description: 'Get the latest NAV for a fund along with the 1-day change percentage.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'get_trailing_returns',
    description: 'Get trailing returns for 1W, 1M, 3M, 6M, 1Y, 3Y, 5Y periods as percentages.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'get_metrics',
    description: 'Get risk-adjusted metrics for a fund: Sharpe, Sortino, max drawdown, alpha, beta, information ratio, category rank percentile, and TER.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'get_category_stats',
    description: 'Get median and average for all metrics across all funds in a SEBI category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'SEBI fund category name',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'compare_funds',
    description: 'Compare 2–10 funds side-by-side on all key metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_codes: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 10,
          description: 'Array of AMFI scheme codes to compare (2–10)',
        },
      },
      required: ['scheme_codes'],
    },
  },
  {
    name: 'screen_funds',
    description: 'Screen and filter funds using quantitative criteria. Returns a ranked list.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by SEBI category (optional)',
        },
        min_return_1y: {
          type: 'number',
          description: 'Minimum 1-year return in % (optional)',
        },
        max_ter: {
          type: 'number',
          description: 'Maximum TER in % (optional)',
        },
        min_sharpe: {
          type: 'number',
          description: 'Minimum Sharpe ratio (optional)',
        },
        plan_type: {
          type: 'string',
          enum: ['direct', 'regular'],
          description: 'Plan type filter (default: direct)',
          default: 'direct',
        },
        limit: {
          type: 'number',
          description: 'Max results (default: 20, max: 50)',
          default: 20,
        },
      },
      required: [],
    },
  },
  {
    name: 'get_holdings',
    description: 'Get top holdings for a fund with percentage of NAV.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'AMFI scheme code',
        },
        limit: {
          type: 'number',
          description: 'Number of top holdings to return (default: 10, max: 50)',
          default: 10,
        },
      },
      required: ['scheme_code'],
    },
  },
  {
    name: 'find_funds_holding',
    description: 'Find all funds that hold a specific stock (by name partial match or ISIN).',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          description: 'Stock name (partial match) or ISIN',
        },
        limit: {
          type: 'number',
          description: 'Max funds to return (default: 20)',
          default: 20,
        },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'get_benchmark',
    description: 'Get TRI (Total Return Index) series for a benchmark index. Available indices: NIFTY 50, NIFTY 100, NIFTY 200, NIFTY 500, NIFTY MIDCAP 50, NIFTY MIDCAP 100, NIFTY MIDCAP 150, NIFTY SMALLCAP 100, NIFTY SMALLCAP 250, NIFTY NEXT 50, NIFTY500 MULTICAP 50:25:25',
    inputSchema: {
      type: 'object',
      properties: {
        index_name: {
          type: 'string',
          description: 'Benchmark index name (e.g. "NIFTY 50", "NIFTY MIDCAP 150")',
        },
        from_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format (optional)',
        },
        to_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (optional)',
        },
      },
      required: ['index_name'],
    },
  },
  {
    name: 'list_sif_strategies',
    description: 'List all 57 SIF (Specialised Investment Fund) strategies with AMC, category, and latest NAV.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_sif_metrics',
    description: 'Get performance metrics for a SIF strategy.',
    inputSchema: {
      type: 'object',
      properties: {
        scheme_code: {
          type: 'string',
          description: 'SIF scheme code in format SIF-XX (e.g. SIF-01)',
        },
      },
      required: ['scheme_code'],
    },
  },
]

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>

const TOOL_HANDLERS: Record<string, ToolHandler> = {
  search_funds:          searchFunds,
  list_categories:       listCategories,
  list_amcs:             listAmcs,
  list_funds_in_category: listFundsInCategory,
  get_fund:              getFund,
  get_nav_history:       getNavHistory,
  get_latest_nav:        getLatestNav,
  get_trailing_returns:  getTrailingReturns,
  get_metrics:           getMetrics,
  get_category_stats:    getCategoryStats,
  compare_funds:         compareFunds,
  screen_funds:          screenFunds,
  get_holdings:          getHoldings,
  find_funds_holding:    findFundsHolding,
  get_benchmark:         getBenchmark,
  list_sif_strategies:   listSifStrategies,
  get_sif_metrics:       getSifMetrics,
}

const server = new Server(
  { name: 'sukoon-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const handler = TOOL_HANDLERS[name]

  if (!handler) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
      isError: true,
    }
  }

  try {
    const result = await handler((args ?? {}) as Record<string, unknown>)
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
      isError: true,
    }
  }
})

async function main() {
  const apiUrl = process.env.SUKOON_API_URL ?? 'https://mcp.sukoon.money'
  process.stderr.write(`Sukoon MCP connecting to ${apiUrl}\n`)
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`)
  process.exit(1)
})
