import { apiGet } from '../client.js'

export async function getBenchmark(args: Record<string, unknown>) {
  if (!args.index_name) return apiGet('/v1/benchmarks')
  const idx = encodeURIComponent(args.index_name as string)
  return apiGet(`/v1/benchmarks/${idx}`, {
    from: args.from_date as string | undefined,
    to: args.to_date as string | undefined,
  })
}
