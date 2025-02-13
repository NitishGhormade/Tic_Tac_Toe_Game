const API_URL = "http://localhost:5000"

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return response.json()
}

export const register = async (username, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return response.json()
}

export const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export const createGame = async () => {
  const response = await fetch(`${API_URL}/game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return response.json()
}

export const makeMove = async (gameId, position) => {
  const response = await fetch(`${API_URL}/game/${gameId}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ position }),
  })
  return response.json()
}

