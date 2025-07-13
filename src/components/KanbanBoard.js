"use client"

import { useState } from "react"
import KanbanColumn from "./KanbanColumn"

function KanbanBoard({ tasks, onEditTask, onDeleteTask, onDragEnd, onSmartAssign }) {
  const [draggingTask, setDraggingTask] = useState(null)

  const handleDragStart = (e, task) => {
    setDraggingTask(task)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task._id)
    e.currentTarget.classList.add("dragging")
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggingTask) {
      onDragEnd(draggingTask._id, newStatus)
      e.currentTarget.classList.remove("dragging") // Remove from column
    }
    setDraggingTask(null)
  }

  const handleDragLeave = (e) => {
    // Optional: remove visual feedback when dragging leaves a column
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging") // Remove from original card
    setDraggingTask(null)
  }

  const todoTasks = tasks.filter((task) => task.status === "Todo")
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress")
  const doneTasks = tasks.filter((task) => task.status === "Done")

  return (
    <div className="kanban-board">
      <KanbanColumn
        title="Todo"
        tasks={todoTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onSmartAssign={onSmartAssign}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
      />
      <KanbanColumn
        title="In Progress"
        tasks={inProgressTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onSmartAssign={onSmartAssign}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
      />
      <KanbanColumn
        title="Done"
        tasks={doneTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onSmartAssign={onSmartAssign}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
      />
    </div>
  )
}

export default KanbanBoard
