<div align="center">
  <img src="assets/sukoon-logo.png" alt="Sukoon" width="64"/>
  <h1>Sukoon MCP</h1>
  <p><strong>Indian mutual fund data for any MCP-capable AI.</strong> 21 tools covering 14,000+ AMFI schemes, 20 years of daily NAV, risk metrics, holdings, 20 NIFTY benchmarks, GIFT City offshore funds, and SIF strategies.</p>
  <p>Leave a ⭐️</p>
  <p><a href="https://sukoon.money">sukoon.money</a> &nbsp;·&nbsp; No signup &nbsp;·&nbsp; No API key &nbsp;·&nbsp; Free for individuals</p>
</div>

---

Sukoon MCP is a hosted, public, **Streamable HTTP** server at:

```
https://mcp.sukoon.money/mcp
```

There is no local install. Every MCP client below connects to this URL. No npm package to run, no key to manage.

---

## Claude Web — three clicks

1. Go to **claude.ai** → Settings → Connectors → **Add custom connector**
2. URL: `https://mcp.sukoon.money/mcp`
3. Auth: **None** → Connect

Open a new chat, look for the Sukoon chip in the composer, start asking. Free plan works.

---

## Claude Desktop

Claude Desktop only speaks stdio, so we run [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) as a local-to-HTTP bridge. Add this to your config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sukoon": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.sukoon.money/mcp"]
    }
  }
}
```

Restart Claude Desktop. Sukoon shows up under MCP Servers as connected.

---

## Cursor

Cursor speaks Streamable HTTP natively — no bridge needed. Edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "sukoon": {
      "type": "streamable-http",
      "url": "https://mcp.sukoon.money/mcp"
    }
  }
}
```

Reload Cursor. Sukoon's 21 tools are available in the chat.

---

## Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "sukoon": {
      "serverUrl": "https://mcp.sukoon.money/mcp"
    }
  }
}
```

Restart Cascade.

---

## Cline (VS Code)

Open the Cline sidebar → **MCP Servers** → **Configure MCP Servers** and add:

```json
{
  "mcpServers": {
    "sukoon": {
      "type": "streamableHttp",
      "url": "https://mcp.sukoon.money/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

If your Cline build only supports stdio, use the `mcp-remote` bridge form from the Claude Desktop section above.

---

## LibreChat

In `librechat.yaml`:

```yaml
mcpServers:
  sukoon:
    type: streamable-http
    url: https://mcp.sukoon.money/mcp
```

Restart LibreChat.

---

## Continue.dev

Add to your Continue config (`~/.continue/config.json`):

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "streamable-http",
          "url": "https://mcp.sukoon.money/mcp"
        }
      }
    ]
  }
}
```

---

## Tools (21)

| Tool | What it does |
|------|-------------|
| `search_funds` | Search by fund name; filter by SEBI category, AMC, optionally include SIFs |
| `list_categories` | All SEBI categories with fund count |
| `list_amcs` | All AMCs with fund count |
| `list_funds_in_category` | Funds in a category ranked by any metric |
| `get_fund` | Fund info: name, AMC, ISIN, TER, min investment, launch date |
| `get_nav_history` | Daily NAV series, filterable by date range (up to 20 years) |
| `get_latest_nav` | Latest NAV with 1-day change % |
| `get_trailing_returns` | 1W / 1M / 3M / 6M / 1Y / 3Y / 5Y returns |
| `get_metrics` | Sharpe, Sortino, max drawdown, alpha, beta, IR, category rank percentile, TER |
| `get_category_stats` | Median and average metrics across all funds in a category |
| `compare_funds` | Side-by-side comparison for 2–10 funds |
| `screen_funds` | Filter by category, min return, max TER, min Sharpe, plan type |
| `get_holdings` | Top portfolio holdings with % NAV weight |
| `find_funds_holding` | Which funds hold a given stock (name or ISIN) |
| `get_debt_quants` | Macaulay / Modified duration, average maturity, YTM (debt + hybrid funds) |
| `get_benchmark` | TRI series for any of 20 NIFTY indices, optional date range |
| `list_sif_strategies` | All 57 SIF (Specialised Investment Fund) strategies with latest NAV |
| `get_sif_metrics` | Performance metrics for a SIF strategy |
| `list_gift_funds` | All GIFT City IFSC retail funds (USD-denominated, NRI-friendly) |
| `get_gift_metrics` | USD-denominated metrics for a GIFT City fund |
| `get_gift_nav_history` | USD NAV history for a GIFT City fund |

---

## Things to ask

```
Compare Parag Parikh Flexi Cap and HDFC Flexi Cap over the last 5 years.
Find all large-cap index funds with TER under 0.10% that beat NIFTY 100.
What is the max drawdown of Quant Small Cap?
Which funds hold Zomato with more than 3% weight?
Show me NIFTY 50 TRI vs Mirae Asset Large Cap returns since 2015.
Screen for mid-cap funds with Sharpe above 0.8 and 3Y return above 18%.
What SIF strategies does Edelweiss offer?
Should I add GIFT-PP-NASDAQ to my Indian large-cap portfolio for diversification?
What is the YTM and modified duration of HDFC Corporate Bond Fund?
Find banking sector funds that beat NIFTY BANK over 3 years on alpha.
```

---

## Data sources

- **NAV**: AMFI daily publish (`NAVAll.txt`), updated every weekday after market close
- **Holdings**: AMFI monthly factsheets + AMFI portfolio disclosures parser (covers 11 AMCs the factsheet feed misses)
- **Benchmarks**: 20 NIFTY TRI series — NIFTY 50, 100, 200, 500, Next 50, Midcap 50/100/150, Smallcap 100/250, LargeMidcap 250, Multicap 50:25:25, plus sector indices: BANK, IT, PHARMA, FMCG, AUTO, METAL, INFRA, ENERGY. Sourced from niftyindices.com.
- **TER**: AMFI monthly TER feed (authoritative; refreshed daily)
- **Debt quants**: AMFI portfolio disclosure parser (Macaulay duration, modified duration, YTM)
- **SIF strategies**: SEBI-registered Specialised Investment Funds (57 strategies)
- **GIFT City**: USD-denominated NAV history for retail outbound funds available to NRIs

All metrics (Sharpe, Sortino, alpha, beta, max drawdown, etc.) are computed in-house from the raw NAV and benchmark series — no third-party scraping.

---

## Built by

<p>
  <img src="assets/alum-bits.jpg" alt="BITS Pilani" height="32"/>
  &nbsp;&nbsp;
  <img src="assets/alum-nomura.png" alt="Nomura" height="28"/>
  &nbsp;&nbsp;
  <img src="assets/alum-revolut.png" alt="Revolut" height="26"/>
  &nbsp;&nbsp;
  <img src="assets/alum-samsung.jpg" alt="Samsung Research" height="28"/>
  &nbsp;&nbsp;
  <img src="assets/alum-sequoia.png" alt="Sequoia Capital" height="26"/>
</p>

Sukoon is built by alums of BITS Pilani, Nomura, Revolut, Samsung Research, and Sequoia Capital.

We believe every retail investor in India deserves the same data quality their wealth manager has. Sukoon makes that available through any AI you already use, for free, forever.

Join the advisory waitlist at [sukoon.money](https://sukoon.money).

---

## License

MIT. See [LICENSE](LICENSE).
