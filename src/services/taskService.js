// const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
const API_URL = process.env.REACT_APP_BACKEND_URL || "https://todosoftwarebackend.onrender.com"

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return {
    "Content-Type": "application/json",
    Authorization: user ? `Bearer ${user.token}` : "",
  }
}

export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }
  return response.json()
}

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to create task")
  }
  return data
}

export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to update task")
  }
  return data
}

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task")
  }
  return data
}

export const updateTaskStatus = async (taskId, newStatus) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}/drag-drop`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newStatus }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to update task status")
  }
  return data
}

export const smartAssignTask = async (taskId) => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}/smart-assign`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to smart assign task")
  }
  return data
}

export const fetchActions = async () => {
  const response = await fetch(`${API_URL}/api/actions`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error("Failed to fetch actions")
  }
  return response.json()
}
