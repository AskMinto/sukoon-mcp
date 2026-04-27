import { apiGet } from '../client.js'

export async function searchFunds(args: Record<string, unknown>) {
  return apiGet('/v1/funds', {
    q: args.q as string,
    category: args.category as string | undefined,
    amc: args.amc as string | undefined,
    include_sif: args.include_sif as boolean | undefined,
    limit: args.limit as number | undefined,
  })
}

export async function listCategories(_args: Record<string, unknown>) {
  return apiGet('/v1/categories')
}

export async function listAmcs(_args: Record<string, unknown>) {
  return apiGet('/v1/amcs')
}

export async function listFundsInCategory(args: Record<string, unknown>) {
  const category = encodeURIComponent(args.category as string)
  return apiGet(`/v1/categories/${category}/funds`, {
    sort_by: args.sort_by as string | undefined,
    limit: args.limit as number | undefined,
  })
}
