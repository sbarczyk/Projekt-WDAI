import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Container, Carousel, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    document.title = "SimpleStore";
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        setFeaturedProducts(data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container className="footer-margin">
      <header className="text-center my-5">
        <h1>Witamy w SimpleStore!</h1>
        <p className="lead">
          Oferujemy szeroki wybór produktów w najlepszych cenach. Sprawdź naszą ofertę i znajdź coś dla siebie!
        </p>
      </header>

      {}
      <Carousel className="mb-5">
        {featuredProducts.map((product) => (
          <Carousel.Item key={product.id}>
            <img
              className="d-block w-100"
              src={product.image}
              alt={product.title}
              style={{ height: "400px", objectFit: "contain" }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
              <h3>{product.title}</h3>
              <p>{product.description.substring(0, 100)}...</p>
              <Link to={`/product/${product.id}`}>
                <Button variant="light">Zobacz więcej</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {}
      <section className="mb-5">
        <Row>
          <Col md={4} className="text-center">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Najlepsze ceny</Card.Title>
                <Card.Text>
                  U nas znajdziesz produkty w najkorzystniejszych cenach na rynku.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="text-center">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Wysoka jakość</Card.Title>
                <Card.Text>
                  Oferujemy tylko produkty, które spełniają najwyższe standardy jakości.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="text-center">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Szybka dostawa</Card.Title>
                <Card.Text>
                  Gwarantujemy szybką i bezproblemową dostawę Twoich zamówień.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {}
      <section className="text-center">
        <h2>Nie czekaj! Sprawdź naszą ofertę już teraz!</h2>
        <p>
          Odwiedź naszą stronę produktów i znajdź coś dla siebie. A jeśli masz pytania, skontaktuj się z nami!
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Zobacz produkty
          </Button>
        </Link>
      </section>
    </Container>
  );
};

export default HomePage;