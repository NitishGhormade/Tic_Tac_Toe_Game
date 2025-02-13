import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = "your-secret-key" // In a real app, use an environment variable

app.use(cors())
app.use(express.json())

// In-memory storage (replace with a database in a real application)
const users = []
const games = []

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" })
  }
  users.push({ username, password })
  res.status(201).json({ message: "User created successfully" })
})

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body
  const user = users.find((user) => user.username === username && user.password === password)
  if (user) {
    const accessToken = jwt.sign({ username: user.username }, JWT_SECRET)
    res.json({ accessToken })
  } else {
    res.status(400).json({ message: "Invalid credentials" })
  }
})

// Get user stats
app.get("/stats", authenticateToken, (req, res) => {
  const userGames = games.filter((game) => game.players.includes(req.user.username))
  const stats = {
    totalGames: userGames.length,
    wins: userGames.filter((game) => game.winner === req.user.username).length,
    losses: userGames.filter((game) => game.winner && game.winner !== req.user.username).length,
    draws: userGames.filter((game) => !game.winner).length,
  }
  res.json(stats)
})

// Create a new game
app.post("/game", authenticateToken, (req, res) => {
  const newGame = {
    id: games.length + 1,
    players: [req.user.username],
    board: Array(9).fill(null),
    currentPlayer: req.user.username,
    winner: null,
  }
  games.push(newGame)
  res.json(newGame)
})

// Make a move
app.post("/game/:id/move", authenticateToken, (req, res) => {
  const { id } = req.params
  const { position } = req.body
  const game = games.find((g) => g.id === Number.parseInt(id))

  if (!game) {
    return res.status(404).json({ message: "Game not found" })
  }

  if (game.winner || game.board[position] !== null) {
    return res.status(400).json({ message: "Invalid move" })
  }

  game.board[position] = game.currentPlayer === game.players[0] ? "X" : "O"
  game.currentPlayer = game.currentPlayer === game.players[0] ? game.players[1] : game.players[0]

  // Check for a winner
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ]

  for (const combo of winningCombos) {
    if (
      game.board[combo[0]] &&
      game.board[combo[0]] === game.board[combo[1]] &&
      game.board[combo[0]] === game.board[combo[2]]
    ) {
      game.winner = req.user.username
      break
    }
  }

  // Check for a draw
  if (!game.winner && !game.board.includes(null)) {
    game.winner = "draw"
  }

  res.json(game)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

