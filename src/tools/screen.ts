import { apiPost } from '../client.js'

export async function screenFunds(args: Record<string, unknown>) {
  return apiPost('/v1/screen', {
    category: args.category,
    min_return_1y: args.min_return_1y,
    max_ter: args.max_ter,
    min_sharpe: args.min_sharpe,
    plan_type: args.plan_type,
    limit: args.limit,
  })
}
