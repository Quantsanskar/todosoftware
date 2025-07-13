"use client"

import { useState, useEffect } from "react"
import Header from "./Header"

function TaskModal({ task, onSave, onClose, conflictData, onResolveConflict, allUsers }) {
  const [title, setTitle] = useState(task ? task.title : "")
  const [description, setDescription] = useState(task ? task.description : "")
  const [status, setStatus] = useState(task ? task.status : "Todo")
  const [priority, setPriority] = useState(task ? task.priority : "Medium")
  const [assignedTo, setAssignedTo] = useState(task && task.assignedTo ? task.assignedTo._id : "")
  const [localError, setLocalError] = useState("")

  const isNewTask = !task

  useEffect(() => {
    if (conflictData) {
      setLocalError(conflictData.message)
      // Optionally, pre-fill form with server version for manual merge
      // For simplicity, we'll let the user decide to overwrite or manually edit current form
    } else {
      setLocalError("")
    }
  }, [conflictData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    const taskData = {
      _id: task ? task._id : undefined,
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || null,
    }

    // Basic client-side validation
    if (!title.trim()) {
      setLocalError("Task title cannot be empty.")
      return
    }
    const columnNames = ["Todo", "In Progress", "Done"]
    if (columnNames.includes(title.trim())) {
      setLocalError("Task title cannot be a column name (Todo, In Progress, Done).")
      return
    }

    try {
      await onSave(taskData, isNewTask)
      // If onSave was successful and no conflict, modal will close via parent
    } catch (err) {
      // Error handled by parent, but if it's a non-conflict error, display here
      if (!conflictData) {
        // Only show if it's not a conflict error
        setLocalError(err.message || "Failed to save task.")
      }
    }
  }

  const handleConflictResolution = (type) => {
    // When resolving, use the current form state as the "merged" or "overwritten" version
    const resolvedTaskData = {
      _id: task._id,
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || null,
    }
    onResolveConflict(type, resolvedTaskData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Header title={isNewTask ? "Create New Task" : "Edit Task"} />
        <div className="modal-body">
          {localError && <div className="message error">{localError}</div>}

          {conflictData && (
            <div className="conflict-display">
              <h5>Conflict Detected!</h5>
              <p>
                This task was modified by <strong>{conflictData.lastModifiedBy}</strong> while you were editing.
              </p>
              <p>
                <strong>Your Version:</strong>
              </p>
              <ul>
                <li>Title: {title}</li>
                <li>Description: {description}</li>
                <li>Status: {status}</li>
                <li>Priority: {priority}</li>
                <li>Assigned To: {allUsers.find((u) => u._id === assignedTo)?.username || "Unassigned"}</li>
              </ul>
              <p>
                <strong>Server Version:</strong>
              </p>
              <ul>
                <li>Title: {conflictData.serverVersion.title}</li>
                <li>Description: {conflictData.serverVersion.description}</li>
                <li>Status: {conflictData.serverVersion.status}</li>
                <li>Priority: {conflictData.serverVersion.priority}</li>
                <li>
                  Assigned To:{" "}
                  {conflictData.serverVersion.assignedTo
                    ? conflictData.serverVersion.assignedTo.username
                    : "Unassigned"}
                </li>
              </ul>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px", marginTop: "10px" }}>
                <button onClick={() => handleConflictResolution("overwrite")}>Overwrite</button>
                <button onClick={() => handleConflictResolution("merge")}>Merge (Use My Edits)</button>
                <button onClick={onClose}>Cancel</button>
              </div>
              <p style={{ fontSize: "12px", color: "#555" }}>
                * "Merge" will save your current edits, effectively overwriting the server version with your changes.
              </p>
            </div>
          )}

          {!conflictData && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority:</label>
                <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To:</label>
                <select id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {/* In a real app, fetch and map allUsers here */}
                  {/* Example: {allUsers.map(user => <option key={user._id} value={user._id}>{user.username}</option>)} */}
                </select>
              </div>
              <div className="modal-footer">
                <button type="submit">{isNewTask ? "Create" : "Save"}</button>
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskModal
