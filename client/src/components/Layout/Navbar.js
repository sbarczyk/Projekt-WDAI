import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MainNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">SimpleStore</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Strona Główna</Nav.Link>
            <Nav.Link as={Link} to="/products">Produkty</Nav.Link>
            <Nav.Link as={Link} to="/cart">Koszyk</Nav.Link>
            <Nav.Link as={Link} to="/orders">Moje Zamówienia</Nav.Link>
          </Nav>
          <Nav>
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin" className="me-3">
                Panel Admina
              </Nav.Link>
            )}
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Zaloguj</Nav.Link>
                <Nav.Link as={Link} to="/register">Zarejestruj</Nav.Link>
              </>
            ) : (
              <NavDropdown title={user.username} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Wyloguj</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;