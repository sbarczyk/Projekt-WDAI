import React, { useEffect, useState, useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const SingleOrderPage = () => {
  const { user, accessToken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
      document.title = "SimpleStore - Szczegóły zamówienia";
    }, []);
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrder();
  }, [id, user, accessToken, navigate]);

  if (!order) return <Container>Ładowanie...</Container>;

  return (
    <Container>
      <h1>Szczegóły zamówienia</h1>
      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Data:</strong> {new Date(order.date).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Ilość</th>
            <th>Cena za sztukę</th>
            <th>Cena całkowita</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.OrderProducts.quantity}</td>
              <td>{p.OrderProducts.price.toFixed(2)}</td>
              <td>{p.OrderProducts.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Łączna kwota: {order.total.toFixed(2)} PLN</h4>
    </Container>
  );
};

export default SingleOrderPage;