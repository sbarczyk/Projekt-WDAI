// controllers/reviewsController.js

const { Review, Product } = require("../models");

const createReview = async (req, res) => {
  try {
    const { productId, email, comment, rating } = req.body;


    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }


    const existingReview = await Review.findOne({
      where: { productId, userId: req.user.id },
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Użytkownik dodał już recenzję do tego produktu" });
    }


    const newReview = await Review.create({
      productId,
      userId: req.user.id,
      email,
      comment,
      rating: Number(rating),
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Błąd podczas tworzenia opinii:", error.message);
    return res.status(500).json({ message: "Błąd serwera" });
  }
};

const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productReviews = await Review.findAll({
      where: { productId },
    });

    return res.json(productReviews);
  } catch (error) {
    console.error("Błąd podczas pobierania opinii:", error.message);
    return res.status(500).json({ message: "Błąd serwera" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Opinia nie znaleziona" });
    }

    if (req.user.role !== "admin" && review.userId !== req.user.id) {
      return res.status(403).json({ message: "Brak uprawnień do usunięcia" });
    }

    await review.destroy();
    return res.json({ message: "Usunięto opinię" });
  } catch (error) {
    console.error("Błąd podczas usuwania opinii:", error.message);
    return res.status(500).json({ message: "Błąd serwera" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;


    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Opinia nie znaleziona" });
    }


    if (req.user.role !== "admin" && review.userId !== req.user.id) {
      return res.status(403).json({ message: "Brak uprawnień do edycji" });
    }


    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    await review.save();

    return res.json({ message: "Opinia została zaktualizowana", review });
  } catch (error) {
    console.error("Błąd podczas edycji opinii:", error.message);
    return res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  createReview,
  getReviewsForProduct,
  deleteReview,
  updateReview,
};
