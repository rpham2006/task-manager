import { useState } from 'react'

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    // Without this the browser reloads the whole page on submit.
    event.preventDefault()

    const trimmed = title.trim()
    if (!trimmed || busy) return

    setBusy(true)
    try {
      await onCreate(trimmed)
      setTitle('')
    } catch {
      // App already shows the message; keep the text so you can retry.
    } finally {
      // Runs whether the request succeeded or threw, so the form
      // never gets stuck disabled.
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        autoFocus
      />
      <button type="submit" disabled={!title.trim() || busy}>
        {busy ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}
