const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace(/\/$/, '')

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    }
  )

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(
      body?.error?.message || `Erro na API: ${response.status}`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  get: (endpoint) =>
    request(endpoint),

  post: (endpoint, data) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  put: (endpoint, data) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  patch: (endpoint, data) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: 'DELETE'
    }),

  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  currentUser: () =>
    request('/auth/me')
}