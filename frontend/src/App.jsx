import { useEffect, useState } from 'react'
import { getTasks } from './api'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>Tasks</h1>

      {error && <p className="error">Could not reach the API: {error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.done ? '[x]' : '[ ]'} {task.title}
          </li>
        ))}
      </ul>

      {!error && tasks.length === 0 && <p>No tasks yet.</p>}
    </main>
  )
}
