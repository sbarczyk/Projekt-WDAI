const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem }],
    });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart.CartItems);
  } catch (error) {
    console.error("Błąd podczas pobierania koszyka:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const addToCart = async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    for (const item of items) {
      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, productId: item.productId },
      });

      if (existingItem) {
        existingItem.quantity += item.quantity;
        await existingItem.save();
      } else {
        await CartItem.create({ ...item, cartId: cart.id });
      }
    }

    const updatedCartItems = await CartItem.findAll({ where: { cartId: cart.id } });
    res.status(200).json({ message: "Koszyk zaktualizowany", items: updatedCartItems });
  } catch (error) {
    console.error("Błąd podczas aktualizacji koszyka:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.query;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Nieprawidłowe dane wejściowe" });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({ message: "Koszyk nie istnieje" });
    }

    const item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return res.status(404).json({ message: "Produkt nie znaleziony w koszyku" });
    }

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: "Ilość produktu zaktualizowana", item });
  } catch (error) {
    console.error("Błąd podczas aktualizacji ilości produktu:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: "Brak ID produktu do usunięcia" });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({ message: "Koszyk nie istnieje" });
    }

    const item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return res.status(404).json({ message: "Produkt nie znaleziony w koszyku" });
    }

    await item.destroy();

    res.status(200).json({ message: "Produkt usunięty z koszyka" });
  } catch (error) {
    console.error("Błąd podczas usuwania produktu z koszyka:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({ message: "Koszyk nie istnieje" });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({ message: "Koszyk wyczyszczony" });
  } catch (error) {
    console.error("Błąd podczas czyszczenia koszyka:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeItemFromCart, clearCart };