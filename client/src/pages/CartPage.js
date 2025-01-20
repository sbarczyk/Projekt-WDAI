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

    const fetchCart = async () => {
      try {
        const { data } = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCartItems(data);
      } catch (error) {
        console.error("Błąd podczas pobierania koszyka:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        const pMap = {};
        data.forEach((p) => {
          pMap[p.id] = p;
        });
        setProductsMap(pMap);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
    };

    fetchCart();
    fetchProducts();
  }, [user, navigate, accessToken]);

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/item?productId=${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      alert("Produkt usunięty z koszyka!");
    } catch (error) {
      console.error("Błąd podczas usuwania produktu z koszyka:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axiosInstance.put(
        "/cart/item",
        { productId, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Błąd podczas aktualizacji ilości produktu:", error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    if (/^\d*$/.test(value)) {
      const quantity = value === "" ? "" : Number(value);
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleBlur = (productId, value) => {
    const quantity = value === "" || value < 1 ? 1 : Number(value);
    updateQuantity(productId, quantity);
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCartItems([]);
      alert("Koszyk wyczyszczony!");
    } catch (error) {
      console.error("Błąd podczas czyszczenia koszyka:", error);
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
  
      const response = await axiosInstance.post(
        "/orders",
        { items, totalPrice },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (response.status === 201) {

        await axiosInstance.delete("/cart", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  

        setCartItems([]);
        alert("Zamówienie zostało pomyślnie utworzone!");
        navigate("/orders");
      } else {
        alert("Nie udało się złożyć zamówienia.");
      }
    } catch (error) {
      console.error("Błąd podczas składania zamówienia:", error.response?.data);
      alert(error?.response?.data?.message || "Błąd składania zamówienia");
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
          <Button className="me-2" onClick={clearCart}>
            Wyczyść koszyk
          </Button>
          <Button onClick={handleCheckout}>Złóż zamówienie</Button>
        </>
      )}
    </Container>
  );
};

export default CartPage;