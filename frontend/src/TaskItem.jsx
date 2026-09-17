export default function TaskItem({ task, onToggle, onDelete }) {
  // Unique per row, so clicking the label toggles the right checkbox.
  const checkboxId = `task-${task.id}`

  return (
    <li className="task">
      <input
        type="checkbox"
        id={checkboxId}
        checked={task.done}
        onChange={() => onToggle(task)}
      />
      <label htmlFor={checkboxId} className={task.done ? 'done' : ''}>
        {task.title}
      </label>
      <button
        type="button"
        className="delete"
        onClick={() => onDelete(task)}
        aria-label={`Delete "${task.title}"`}
      >
        ×
      </button>
    </li>
  )
}
