const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");


router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/item", protect, updateCartItem);
router.delete("/item", protect, removeItemFromCart);
router.delete("/", protect, clearCart);

module.exports = router;