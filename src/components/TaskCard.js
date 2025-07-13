"use client"

function TaskCard({ task, onEdit, onDelete, onSmartAssign, onDragStart, onDragEnd }) {
  const assignedToName = task.assignedTo ? task.assignedTo.username : "Unassigned"
  const lastModifiedBy = task.lastModifiedBy ? task.lastModifiedBy.username : "Unknown"
  const lastModifiedAt = new Date(task.lastModifiedAt).toLocaleString()

  return (
    <div className="task-card" draggable="true" onDragStart={(e) => onDragStart(e, task)} onDragEnd={onDragEnd}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Assigned: {assignedToName}</small>
      <small>Priority: {task.priority}</small>
      <small>
        Last Modified: {lastModifiedAt} by {lastModifiedBy}
      </small>
      <div className="task-card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task._id)}>Delete</button>
        <button onClick={() => onSmartAssign(task._id)}>Smart Assign</button>
      </div>
    </div>
  )
}

export default TaskCard
