import { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
  }, [])

  async function handleCreate(title) {
    try {
      const created = await createTask(title)
      // A NEW array — React re-renders on reference change, not mutation.
      setTasks((current) => [...current, created])
      setError(null)
    } catch (err) {
      setError(err.message)
      // Rethrow so TaskForm knows it failed and keeps what you typed.
      throw err
    }
  }

  async function handleToggle(task) {
    try {
      // Send only what changes; the API leaves `title` untouched.
      const updated = await updateTask(task.id, { done: !task.done })
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(task) {
    try {
      await deleteTask(task.id)
      setTasks((current) => current.filter((t) => t.id !== task.id))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const remaining = tasks.filter((task) => !task.done).length

  return (
    <main>
      <h1>Tasks</h1>

      <TaskForm onCreate={handleCreate} />

      {error && <p className="error">{error}</p>}

      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet.</p>
      ) : (
        <p className="count">
          {remaining} of {tasks.length} remaining
        </p>
      )}
    </main>
  )
}
