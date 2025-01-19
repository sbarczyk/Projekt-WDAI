import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { Container, Form, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProductsPage = () => {
  const { user } = useContext(AuthContext);
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
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product) => {
     
    if (!user) {
      navigate("/login");
      return;
    }
    
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "" || Number(value) > 0) {
      setQuantity(value);
    }
  };

  const handleConfirmAddToCart = () => {

    const finalQuantity = Number(quantity) || 1;
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.productId === selectedProduct.id);
  
    if (existingProduct) {
      existingProduct.quantity += finalQuantity;
    } else {
      cart.push({ productId: selectedProduct.id, quantity: finalQuantity });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produkt dodany do koszyka!");
    setShowModal(false);
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
        {filtered.map((product) => (
          <Col key={product.id} sm={12} md={6} lg={4} className="mb-3">
            <Card
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Dodaj do koszyka
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj do koszyka</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p><strong>Produkt:</strong> {selectedProduct.title}</p>
              <p><strong>Cena:</strong> {selectedProduct.price} PLN</p>
              <Form.Group>
                <Form.Label>Ilość:</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={handleQuantityChange}
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