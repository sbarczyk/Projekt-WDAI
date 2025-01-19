import React, { useEffect, useState, useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const OrdersPage = () => {
  const { user, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
      document.title = "SimpleStore - Zamówienia";
    }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [user, accessToken, navigate]);

  return (
    <Container>
      <h1>Moje Zamówienia</h1>
      {orders.length === 0 ? (
        <p>Brak zamówień.</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID Zamówienia</th>
              <th>Data</th>
              <th>Ilość pozycji</th>
              <th>Koszt</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link to={`/orders/${o.id}`}>{o.id}</Link>
                </td>
                <td>{new Date(o.date).toLocaleString()}</td>
                <td>{o.products.reduce((acc, p) => acc + p.OrderProducts.quantity, 0)}</td>
                <td>{o.total}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;