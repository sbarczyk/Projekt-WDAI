import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Form, Row, Col, Modal } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");


  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
      document.title = "SimpleStore - Panel administratora";
    }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć produkt?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/products",
        {
          title,
          price: Number(price),
          description,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTitle("");
      setPrice("");
      setDescription("");
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPrice = (product) => {
    setEditingProduct(product);
    setEditedPrice(product.price);
  };

  const handleSavePrice = async () => {
    try {
      await axiosInstance.put(
        `/products/${editingProduct.id}`,
        { price: Number(editedPrice) },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setEditingProduct(null);
      setEditedPrice("");
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h1>Panel administracyjny</h1>
      <Row>
        <Col md={6}>
          <h3>Lista produktów</h3>
          <Table bordered>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Cena</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.price} PLN</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEditPrice(p)}
                      >
                        Edytuj cenę
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <h3>Dodaj nowy produkt</h3>
          <Form onSubmit={handleCreateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Nazwa</Form.Label>
              <Form.Control
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cena</Form.Label>
              <Form.Control
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Dodaj</Button>
          </Form>
        </Col>
      </Row>

      {/* Modal edycji ceny */}
      <Modal show={!!editingProduct} onHide={() => setEditingProduct(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj cenę</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Cena</Form.Label>
            <Form.Control
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              required
              min={0}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingProduct(null)}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleSavePrice}>
            Zapisz
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPage;