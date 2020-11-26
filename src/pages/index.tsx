import React from "react"
import NavbarLayout from "../NavBar/NavbarLayout"
import Jumbotron from "react-bootstrap/Jumbotron"
import  Button  from "react-bootstrap/Button"
const styles = require("./index.module.css")

export default function Home() {

  return (
    <NavbarLayout>
      <Jumbotron className={styles.jumbotron}>
      <h2 className={styles.title}>Welcome to Shaikh Bookmark App</h2>
      <Button href="/bookmark" variant="outline-dark">View Bookmark</Button>
      </Jumbotron>
    </NavbarLayout>
  )
}
