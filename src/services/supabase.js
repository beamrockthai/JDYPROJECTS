// Lightweight Supabase REST client (PostgREST) – no extra dependency required.
// Configure in .env:  VITE_SUPABASE_URL=...   VITE_SUPABASE_ANON_KEY=...
function getConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  return { url, key, isConfigured: Boolean(url && key) }
}

export function isSupabaseConfigured() {
  return getConfig().isConfigured
}

export async function supabaseRequest(table, { method = 'GET', query = '', body, prefer } = {}) {
  const { url, key, isConfigured } = getConfig()
  if (!isConfigured) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error((await response.text()) || `HTTP ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}
