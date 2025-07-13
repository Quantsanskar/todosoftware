"use client"

import { createContext, useContext, useEffect, useState } from "react"
import io from "socket.io-client"

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"

  useEffect(() => {
    const newSocket = io(backendUrl, {
      withCredentials: true,
    })

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server")
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server")
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [backendUrl])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
