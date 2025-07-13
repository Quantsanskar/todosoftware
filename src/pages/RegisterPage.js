"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await register(username, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="window" style={{ width: "350px" }}>
        <Header title="Register" />
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="message error">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button type="submit">Register</button>
              <button type="button" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
