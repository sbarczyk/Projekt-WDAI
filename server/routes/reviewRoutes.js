// routes/reviews.js
const express = require("express");
const {
  createReview,
  getReviewsForProduct,
  deleteReview,
  updateReview
} = require("../controllers/reviewController");


const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", protect, createReview);

router.get("/product/:productId", getReviewsForProduct);

router.delete("/:id", protect, deleteReview);

router.put("/:id", protect, updateReview);

module.exports = router;