import React from "react"
import NavbarLayout from "../NavBar/NavbarLayout"
import { Router } from "@reach/router"
import Dashboard from "../components/Dashboard"

export default function App() {
  return (
    <NavbarLayout>
      <Router>
        <Dashboard path="/bookmark" />
      </Router>
    </NavbarLayout>
  )
}
