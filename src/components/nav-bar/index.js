import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function NavBarBootstrap({ handleAuth }) {
  const currentUrl = useLocation();

  return (
    <>
      {
        <Navbar
          bg="dark"
          variant="dark"
          expand="md"
          className="sticky-top border-bottom border-2"
        >
          <Container>
            <Navbar.Brand as={Link} to="/">
              Blog
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav
                className="justify-content-end flex-grow-1 pe-3 align-items-center"
                activeKey={
                  currentUrl.pathname === "/latest" ? "/" : currentUrl.pathname
                }
              >
                <Nav.Link as={Link} to="/" eventKey="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" eventKey="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/new" eventKey="/new">
                  New Post
                </Nav.Link>
                <Nav.Item>
                  <Button variant="outline-light" onClick={handleAuth}>
                    Login
                  </Button>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }
    </>
  );
}

export default NavBarBootstrap;
