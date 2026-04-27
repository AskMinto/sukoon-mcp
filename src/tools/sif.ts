import { apiGet } from '../client.js'

export async function listSifStrategies(_args: Record<string, unknown>) {
  return apiGet('/v1/sif')
}

export async function getSifMetrics(args: Record<string, unknown>) {
  return apiGet(`/v1/sif/${args.scheme_code}/metrics`)
}
