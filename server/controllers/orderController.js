const { Order, Product, User, OrderProducts } = require("../models");

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ message: "Nieprawidłowe dane zamówienia" });
    }

    const newOrder = await Order.create({
      userId: req.user.id,
      total: totalPrice,
      status: "pending",
    });

    const orderProducts = items.map((item) => ({
      OrderId: newOrder.id,
      ProductId: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    await OrderProducts.bulkCreate(orderProducts);

    res.status(201).json({ message: "Zamówienie utworzone", order: newOrder });
  } catch (error) {
    console.error("Błąd podczas tworzenia zamówienia:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price", "total"] },
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień użytkownika:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price", "total"] },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Zamówienie nie znalezione" });
    }

    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Brak dostępu do tego zamówienia" });
    }

    res.json(order);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówienia:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Brak uprawnień do tej operacji" });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price", "total"] },
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania wszystkich zamówień:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, getAllOrders };