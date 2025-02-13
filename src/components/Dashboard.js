"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Dashboard({ setAuth }) {
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  })

  useEffect(() => {
    getStats()
  }, [])

  const getStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/stats", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      const parseRes = await response.json()
      setStats(parseRes)
    } catch (err) {
      console.error(err.message)
    }
  }

  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4">Your Stats</h2>
        <p>Total Games: {stats.totalGames}</p>
        <p>Wins: {stats.wins}</p>
        <p>Losses: {stats.losses}</p>
        <p>Draws: {stats.draws}</p>
      </div>
      <Link to="/game" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
        New Game
      </Link>
      <button onClick={(e) => logout(e)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  )
}

export default Dashboard

