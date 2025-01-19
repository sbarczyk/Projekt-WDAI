import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
      document.title = "SimpleStore - Zaloguj się";
    }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        username,
        password
      });
      login(data.user, data.accessToken);
      alert("Zalogowano!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Błąd logowania");
    }
  };

  return (
    <Container>
      <h1>Logowanie</h1>
      <Form onSubmit={handleLogin}>
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
        <Button type="submit">Zaloguj</Button>
      </Form>
    </Container>
  );
};

export default LoginPage;