import React, { ReactNode, useContext } from "react"
import { Navbar, Nav, Container } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "gatsby"
import Footer from '../components/Footer'
const styles = require("./NavbarLayout.module.css")

interface props {
  children: ReactNode
}

export default function NavbarLayout({ children }: props) {

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Navbar.Brand>Shaikh Bookmark App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={"/bookmark"}>
              Bookmark{" "}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>{children}</Container>
      <Footer />
    </div>
  )
}
