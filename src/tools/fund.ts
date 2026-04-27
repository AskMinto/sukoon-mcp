import { apiGet } from '../client.js'

export async function getFund(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}`)
}

export async function getNavHistory(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}/nav`, {
    from: args.from_date as string | undefined,
    to: args.to_date as string | undefined,
  })
}

export async function getLatestNav(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}/nav/latest`)
}

export async function getTrailingReturns(args: Record<string, unknown>) {
  return apiGet(`/v1/funds/${args.scheme_code}/returns`)
}
