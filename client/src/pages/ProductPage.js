import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    document.title = "SimpleStore - Szczegóły produktu";
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Błąd podczas pobierania produktu:", error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/${id}`);
        setReviews(data);
      } catch (error) {
        console.error("Błąd podczas pobierania opinii:", error);
      }
    };
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const cartItem = {
        productId: id,
        quantity: Number(quantity),
      };

      await axiosInstance.post(
        "/cart",
        { items: [cartItem] },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      alert("Produkt dodany do koszyka!");
    } catch (error) {
      console.error("Błąd podczas dodawania do koszyka:", error.response?.data);
      alert(error?.response?.data?.message || "Błąd dodawania do koszyka");
    }
  };

  if (!product) return <Container>Wczytywanie...</Container>;

  return (
    <Container>
      <Row>
        <Col md={6}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: "100%", objectFit: "contain" }}
          />
        </Col>
        <Col md={6}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <h4>Cena: {product.price} PLN</h4>
          <Form.Group controlId="quantity" className="mb-3">
            <Form.Label>Ilość:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Button onClick={handleAddToCart}>Dodaj do koszyka</Button>
        </Col>
      </Row>
      <hr />
      <h3>Opinie:</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <strong>{review.email}</strong> ({review.rating} ★)
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>Brak opinii dla tego produktu.</p>
      )}
    </Container>
  );
};

export default ProductPage;