import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { Container, Form, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProductsPage = () => {
  const { user, accessToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SimpleStore - Produkty";
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const cartItem = {
        productId: selectedProduct.id,
        quantity: Number(quantity) || 1,
      };

      await axiosInstance.post(
        "/cart",
        { items: [cartItem] },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      alert("Produkt dodany do koszyka!");
      setShowModal(false);
    } catch (error) {
      console.error("Błąd podczas dodawania do koszyka:", error.response?.data);
      alert(error?.response?.data?.message || "Błąd dodawania do koszyka");
    }
  };

  return (
    <Container>
      <h1>Lista produktów</h1>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Szukaj po nazwie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>
      <Row>
        {products
          .filter((product) =>
            product.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>
                    {product.description.substring(0, 60)}...
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => handleAddToCart(product)}
                  >
                    Dodaj do koszyka
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj do koszyka</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p>
                <strong>Produkt:</strong> {selectedProduct.title}
              </p>
              <p>
                <strong>Cena:</strong> {selectedProduct.price} PLN
              </p>
              <Form.Group>
                <Form.Label>Ilość:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleConfirmAddToCart}>
            Dodaj do koszyka
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsPage;