import { apiGet, apiPost } from '../client.js'

export async function getMetrics(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}/metrics`)
}

export async function getCategoryStats(args: Record<string, unknown>) {
  const category = encodeURIComponent(args.category as string)
  return apiGet(`/v1/categories/${category}/stats`)
}

export async function compareFunds(args: Record<string, unknown>) {
  return apiPost('/v1/compare', { scheme_codes: args.scheme_codes })
}
