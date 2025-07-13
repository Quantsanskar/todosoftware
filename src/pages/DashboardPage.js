"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { SocketProvider, useSocket } from "../context/SocketContext"
import {
  fetchTasks,
  fetchActions,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  smartAssignTask,
} from "../services/taskService"
import Header from "../components/Header"
import KanbanBoard from "../components/KanbanBoard"
import ActivityLog from "../components/ActivityLog"
import TaskModal from "../components/TaskModal"

function DashboardContent() {
  const { user, logout } = useAuth()
  const socket = useSocket()
  const [tasks, setTasks] = useState([])
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null) // For editing
  const [conflictData, setConflictData] = useState(null) // For conflict resolution

  const loadData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const fetchedTasks = await fetchTasks()
      setTasks(fetchedTasks)
      const fetchedActions = await fetchActions()
      setActions(fetchedActions)
    } catch (err) {
      setError(err.message || "Failed to load data.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!socket) return

    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask])
    })

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
    })

    socket.on("taskDeleted", (deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTaskId))
    })

    socket.on("actionLogged", (latestActions) => {
      setActions(latestActions)
    })

    return () => {
      socket.off("taskAdded")
      socket.off("taskUpdated")
      socket.off("taskDeleted")
      socket.off("actionLogged")
    }
  }, [socket])

  const handleAddTask = () => {
    setCurrentTask(null) // Clear current task for new creation
    setConflictData(null) // Clear any conflict data
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setCurrentTask(task)
    setConflictData(null)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData, isNewTask, forceOverwrite = false) => {
    setError("")
    try {
      if (isNewTask) {
        await createTask(taskData)
      } else {
        // Add client's lastModifiedAt for conflict detection
        const dataToSend = { ...taskData, lastModifiedAt: currentTask.lastModifiedAt }
        try {
          await updateTask(taskData._id, dataToSend)
          setConflictData(null) // Clear conflict if successful
        } catch (err) {
          if (err.message && err.message.includes("Conflict")) {
            const errorData = JSON.parse(err.message.substring(err.message.indexOf("{")))
            setConflictData(errorData)
            // Keep modal open to resolve conflict
            return
          }
          throw err // Re-throw other errors
        }
      }
      setIsModalOpen(false)
      setCurrentTask(null)
    } catch (err) {
      setError(err.message || "Failed to save task.")
      console.error(err)
    }
  }

  const handleResolveConflict = async (resolutionType, updatedTaskData) => {
    setError("")
    try {
      if (resolutionType === "overwrite") {
        // Send the user's version, server will overwrite
        await updateTask(updatedTaskData._id, { ...updatedTaskData, lastModifiedAt: new Date() }) // Force update timestamp
      } else if (resolutionType === "merge") {
        // User has manually merged, send their new version
        await updateTask(updatedTaskData._id, { ...updatedTaskData, lastModifiedAt: new Date() }) // Force update timestamp
      }
      setConflictData(null)
      setIsModalOpen(false)
      setCurrentTask(null)
    } catch (err) {
      setError(err.message || "Failed to resolve conflict.")
      console.error(err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setError("")
      try {
        await deleteTask(taskId)
      } catch (err) {
        setError(err.message || "Failed to delete task.")
        console.error(err)
      }
    }
  }

  const handleDragEnd = async (taskId, newStatus) => {
    setError("")
    try {
      await updateTaskStatus(taskId, newStatus)
    } catch (err) {
      setError(err.message || "Failed to update task status.")
      console.error(err)
    }
  }

  const handleSmartAssign = async (taskId) => {
    setError("")
    try {
      await smartAssignTask(taskId)
    } catch (err) {
      setError(err.message || "Failed to smart assign task.")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="auth-container">
        <div className="window" style={{ width: "200px", textAlign: "center", padding: "20px" }}>
          <Header title="Loading..." />
          <div className="modal-body">
            <p>Loading tasks and actions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="window">
        <Header title={`Welcome, ${user.username}!`} showClose={false}>
          <button onClick={logout}>Logout</button>
        </Header>
        <div className="modal-body" style={{ padding: "10px" }}>
          {error && <div className="message error">{error}</div>}
          <button onClick={handleAddTask} style={{ marginBottom: "10px" }}>
            Add New Task
          </button>
          <KanbanBoard
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleDragEnd}
            onSmartAssign={handleSmartAssign}
          />
          <ActivityLog actions={actions} />
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={currentTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false)
            setCurrentTask(null)
            setConflictData(null) // Clear conflict data on close
            setError("")
          }}
          conflictData={conflictData}
          onResolveConflict={handleResolveConflict}
          allUsers={[]} // In a real app, fetch all users for assignment dropdown
        />
      )}
    </div>
  )
}

function DashboardPage() {
  return (
    <SocketProvider>
      <DashboardContent />
    </SocketProvider>
  )
}

export default DashboardPage
