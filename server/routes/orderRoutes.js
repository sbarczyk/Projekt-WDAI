const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/rolesMiddleware");

router.get("/myorders", protect, getUserOrders);
router.get("/all", protect, requireAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);

module.exports = router;