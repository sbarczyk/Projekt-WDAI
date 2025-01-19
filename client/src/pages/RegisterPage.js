import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
      document.title = "SimpleStore - Zarejestruj się";
    }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", { username, password });
      alert("Konto utworzone. Możesz się zalogować!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Błąd rejestracji");
    }
  };

  return (
    <Container>
      <h1>Rejestracja</h1>
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Zarejestruj</Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;