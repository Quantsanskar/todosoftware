// const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
const API_URL = process.env.REACT_APP_BACKEND_URL || "https://todosoftwarebackend.onrender.com"

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }
  return data
}

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }
  return data
}
