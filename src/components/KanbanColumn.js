"use client"
import TaskCard from "./TaskCard"

function KanbanColumn({
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  onSmartAssign,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragEnd,
}) {
  const handleDrop = (e) => {
    onDrop(e, title) // Pass the column title as the new status
  }

  return (
    <div className="kanban-column" onDragOver={onDragOver} onDrop={handleDrop} onDragLeave={onDragLeave}>
      <div className="kanban-column-header">{title}</div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onSmartAssign={onSmartAssign}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanColumn
