const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/rolesMiddleware");

// public
router.get("/", getProducts);
router.get("/:id", getProductById);

// admin
router.post("/", protect, requireAdmin, createProduct);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;