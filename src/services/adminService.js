import { supabaseRequest } from './supabase'

const sessionKey = 'jyd-admin-session'

export function getAdminSession() {
  try {
    return JSON.parse(window.sessionStorage.getItem(sessionKey))
  } catch {
    return null
  }
}

export function clearAdminSession() {
  try {
    window.sessionStorage.removeItem(sessionKey)
  } catch {
    // ignore
  }
}

export async function signInAdmin(username, password) {
  const query =
    `select=id,username,full_name,role&username=eq.${encodeURIComponent(username)}` +
    `&password=eq.${encodeURIComponent(password)}&is_active=eq.true&limit=1`
  const rows = await supabaseRequest('admin_users', { query })
  const user = rows?.[0]
  if (!user) return null

  // Fire and forget: record last login.
  supabaseRequest('admin_users', {
    method: 'PATCH',
    query: `id=eq.${user.id}`,
    body: { last_login_at: new Date().toISOString() },
  }).catch(() => {})

  window.sessionStorage.setItem(sessionKey, JSON.stringify(user))
  return user
}

export function createInquiry(form) {
  return supabaseRequest('customer_inquiries', {
    method: 'POST',
    body: {
      name: form.name.trim(),
      company: form.company.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim(),
      service: form.service || null,
      message: form.message.trim(),
      status: 'pending',
    },
  })
}

export function listInquiries() {
  return supabaseRequest('customer_inquiries', { query: 'select=*&order=created_at.desc' })
}

export function updateInquiry(id, changes) {
  return supabaseRequest('customer_inquiries', {
    method: 'PATCH',
    query: `id=eq.${id}`,
    body: changes,
    prefer: 'return=representation',
  })
}

export function deleteInquiry(id) {
  return supabaseRequest('customer_inquiries', { method: 'DELETE', query: `id=eq.${id}` })
}
