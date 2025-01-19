import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [editReview, setEditReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
      document.title = "SimpleStore - Szczegóły produktu";
    }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
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
        console.error(error);
      }
    };
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.productId === id);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.push({ productId: id, quantity: Number(quantity) });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Dodano do koszyka!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post(
        "/reviews",
        {
          productId: id,
          email,
          comment,
          rating: parseInt(rating, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Dodano opinię!");
      setEmail("");
      setComment("");
      setRating(5);
      const { data } = await axiosInstance.get(`/reviews/${id}`);
      setReviews(data);
    } catch (error) {
      console.error("Błąd podczas dodawania opinii:", error.response?.data);
      alert(error?.response?.data?.message || "Błąd dodawania opinii");
    }
  };

  const handleEditReview = (review) => {
    setEditReview(review);
    setComment(review.comment);
    setRating(review.rating);
    setShowEditModal(true);
  };

  const handleSaveReview = async () => {
    if (!editReview) return;
    try {
      await axiosInstance.put(
        `/reviews/${editReview.id}`,
        {
          comment,
          rating: parseInt(rating, 10),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setReviews(
        reviews.map((r) =>
          r.id === editReview.id ? { ...r, comment, rating } : r
        )
      );
      setShowEditModal(false);
      setEditReview(null);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Błąd podczas edycji opinii:", error.response?.data);
      alert(error?.response?.data?.message || "Błąd edycji opinii");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Błąd usuwania opinii");
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
      <Row className="mt-4">
        <Col md={6}>
          <h3>Opinie:</h3>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
              <p>
                <strong>{rev.email}</strong> ({rev.rating} ★)
              </p>
              <p>{rev.comment}</p>
              {(user?.role === "admin" || user?.id === rev.userId) && (
                <>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditReview(rev)}
                    className="me-2"
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteReview(rev.id)}
                  >
                    Usuń
                  </Button>
                </>
              )}
            </div>
          ))}
        </Col>
        <Col md={6}>
          <h3>Dodaj opinię:</h3>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Opinia:</Form.Label>
              <Form.Control
                as="textarea"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ocena (1-5):</Form.Label>
              <Form.Control
                type="number"
                required
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-3">
              Wyślij
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj opinię</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Komentarz:</Form.Label>
            <Form.Control
              as="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Ocena (1-5):</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleSaveReview}>
            Zapisz
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductPage;