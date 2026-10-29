export function isDbEnabled(): boolean {
  const url = process.env.DATABASE_URL
  return Boolean(url && url.trim())
}

