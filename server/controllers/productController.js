const { Product } = require("../models");


const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Błąd podczas pobierania produktów:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }
    res.json(product);
  } catch (error) {
    console.error("Błąd podczas pobierania produktu:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Błąd podczas tworzenia produktu:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error("Błąd podczas aktualizacji produktu:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    await product.destroy();
    res.json({ message: "Produkt został usunięty" });
  } catch (error) {
    console.error("Błąd podczas usuwania produktu:", error.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};