const BASE = '/api'

async function request(path, options) {
  const response = await fetch(BASE + path, options)
  if (!response.ok) {
    throw new Error(`${options?.method ?? 'GET'} ${path} failed: ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

// Every write sends JSON, so the headers/stringify live in one place.
function send(method, path, body) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getTasks() {
  return request('/tasks')
}

export function createTask(title) {
  return send('POST', '/tasks', { title })
}

// `changes` holds only the fields to change, e.g. { done: true }.
// The API leaves everything else alone.
export function updateTask(id, changes) {
  return send('PATCH', `/tasks/${id}`, changes)
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' })
}
