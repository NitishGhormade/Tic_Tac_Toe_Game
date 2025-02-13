"use client"

import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"

function Game() {
  const [game, setGame] = useState(null)
  const history = useHistory()

  useEffect(() => {
    createGame()
  }, [])

  const createGame = async () => {
    try {
      const response = await fetch("http://localhost:5000/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const parseRes = await response.json()
      setGame(parseRes)
    } catch (err) {
      console.error(err.message)
    }
  }

  const makeMove = async (position) => {
    if (!game || game.winner || game.board[position] !== null) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/game/${game.id}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ position }),
      })

      const parseRes = await response.json()
      setGame(parseRes)
    } catch (err) {
      console.error(err.message)
    }
  }

  const renderSquare = (position) => {
    return (
      <button
        className="w-20 h-20 bg-white border border-gray-300 text-4xl font-bold"
        onClick={() => makeMove(position)}
      >
        {game && game.board[position]}
      </button>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>
      {game ? (
        <div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => renderSquare(position))}
          </div>
          {game.winner && (
            <p className="text-xl font-bold mb-4">
              {game.winner === "draw" ? "It's a draw!" : `Winner: ${game.winner}`}
            </p>
          )}
          <button onClick={createGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            New Game
          </button>
        </div>
      ) : (
        <p>Loading game...</p>
      )}
      <button
        onClick={() => history.push("/dashboard")}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Back to Dashboard
      </button>
    </div>
  )
}

export default Game

