"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { loginUser, registerUser } from "../services/authService"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (username, password) => {
    try {
      const userData = await registerUser(username, password)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
