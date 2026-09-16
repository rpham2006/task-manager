const BASE = '/api'

async function request(path, options) {
  const response = await fetch(BASE + path, options)
  if (!response.ok) {
    throw new Error(`${options?.method ?? 'GET'} ${path} failed: ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

export function getTasks() {
  return request('/tasks')
}
