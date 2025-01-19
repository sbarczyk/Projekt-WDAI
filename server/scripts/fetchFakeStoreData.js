const axios = require("axios");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");
const { User, Product } = require("../models");

const users = [
  {
    username: "admin",
    password: bcrypt.hashSync("adminpass", 10),
    role: "admin",
  },
  {
    username: "sbarczyk",
    password: bcrypt.hashSync("sbarczykpass", 10),
    role: "user",
  },
  {
    username: "jdylag",
    password: bcrypt.hashSync("jdylagpass", 10),
    role: "user",
  },
];

async function fetchAndSaveData() {
  try {
    await sequelize.authenticate();
    console.log("Połączono z bazą danych!");

    await sequelize.sync({ force: true });

    await User.bulkCreate(users);
    console.log("Użytkownicy zostali zapisani!");

    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    const formattedProducts = products.map((product) => ({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category || "general",
    }));


    await Product.bulkCreate(formattedProducts);
    console.log("Produkty zostały zapisane!");

    console.log("Baza danych została zainicjalizowana!");
  } catch (error) {
    console.error("Błąd podczas inicjalizacji bazy danych:", error.message);
  } finally {
    await sequelize.close();
    console.log("Połączenie z bazą danych zostało zamknięte.");
  }
}


fetchAndSaveData();