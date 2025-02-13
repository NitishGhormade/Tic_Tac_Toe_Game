"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

function Register({ setAuth }) {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })

  const { username, password } = inputs

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { username, password }
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const parseRes = await response.json()

      if (parseRes.message === "User created successfully") {
        const loginResponse = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        const loginParseRes = await loginResponse.json()

        if (loginParseRes.accessToken) {
          localStorage.setItem("token", loginParseRes.accessToken)
          setAuth(true)
        }
      } else {
        setAuth(false)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmitForm} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl mb-4">Register</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => onChange(e)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
        <Link to="/login" className="block mt-4 text-blue-500">
          Already have an account? Login
        </Link>
      </form>
    </div>
  )
}

export default Register

