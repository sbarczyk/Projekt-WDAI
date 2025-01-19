import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const CartPage = () => {
  const { user, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
      document.title = "SimpleStore - Koszyk";
    }, []);
    
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        const pMap = {};
        data.forEach((p) => {
          pMap[p.id] = p;
        });
        setProductsMap(pMap);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const removeFromCart = (productId) => {
    const newCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (productId, newQuantity) => {
    const newCart = cartItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (productId, value) => {
    if (/^\d*$/.test(value)) {
      // Tylko cyfry lub puste pole są dozwolone
      updateQuantity(productId, value === "" ? "" : Number(value));
    }
  };

  const handleBlur = (productId, value) => {
    if (value === "" || value < 1) {
      updateQuantity(productId, 1); // Ustaw domyślną wartość na 1
    }
  };

  const getTotalPrice = () => {
    let sum = 0;
    cartItems.forEach((ci) => {
      const p = productsMap[ci.productId];
      if (p) {
        sum += p.price * ci.quantity;
      }
    });
    return sum.toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const items = cartItems.map((ci) => {
        const product = productsMap[ci.productId];
        return {
          productId: ci.productId,
          quantity: ci.quantity,
          price: product.price,
        };
      });
  
      const totalPrice = getTotalPrice();
  
      await axiosInstance.post(
        "/orders",
        { items, totalPrice },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Zamówienie utworzone!");
      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Błąd finalizacji zamówienia");
    }
  };

  return (
    <Container>
      <h1>Koszyk</h1>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Cena za sztukę</th>
                <th>Ilość</th>
                <th>Cena całkowita</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const p = productsMap[item.productId];
                return (
                  <tr key={item.productId}>
                    <td>{p?.title}</td>
                    <td>{p ? p.price.toFixed(2) : "-"}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(item.productId, e.target.value)
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>{p ? (p.price * item.quantity).toFixed(2) : "-"}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Usuń
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <h4>Suma: {getTotalPrice()} PLN</h4>
          <Button onClick={handleCheckout}>Złóż zamówienie</Button>
        </>
      )}
    </Container>
  );
};

export default CartPage;