import React, { useContext } from "react"
import NavbarLayout from "../NavBar/NavbarLayout"
import Button from "react-bootstrap/Button"
import { identityContext } from "../context/NetlifyContext"
import Jumbotron from "react-bootstrap/Jumbotron"
const styles = require("./index.module.css")

export default function Home() {
  const { user, identity } = useContext(identityContext)

  return (
    <NavbarLayout>
      <Jumbotron className={styles.jumbotron}>
      <h2 className={styles.title}>Welcome to Shaikh Todo-App</h2>

        {!user ? (
          <Button
            onClick={() => {
              identity.open()
            }}
            variant="outline-dark"
          >
            Login
          </Button>
        ) : (
          <Button
            onClick={() => {
              identity.logout()
            }}
            variant="outline-dark"
          >
            Logout
          </Button>
        )}
      </Jumbotron>
    </NavbarLayout>
  )
}
