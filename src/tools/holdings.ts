import { apiGet } from '../client.js'

export async function getHoldings(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}/holdings`, {
    limit: args.limit as number | undefined,
  })
}

export async function findFundsHolding(args: Record<string, unknown>) {
  return apiGet('/v1/holdings/search', {
    q: args.identifier as string,
    limit: args.limit as number | undefined,
  })
}
