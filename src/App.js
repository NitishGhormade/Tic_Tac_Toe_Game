"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Game from "./components/Game"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }

  return (
    <Router>
      <div className="container">
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) =>
              !isAuthenticated ? <Login {...props} setAuth={setAuth} /> : <Redirect to="/dashboard" />
            }
          />
          <Route
            exact
            path="/register"
            render={(props) =>
              !isAuthenticated ? <Register {...props} setAuth={setAuth} /> : <Redirect to="/dashboard" />
            }
          />
          <Route
            exact
            path="/dashboard"
            render={(props) =>
              isAuthenticated ? <Dashboard {...props} setAuth={setAuth} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/game"
            render={(props) => (isAuthenticated ? <Game {...props} /> : <Redirect to="/login" />)}
          />
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </div>
    </Router>
  )
}

export default App

