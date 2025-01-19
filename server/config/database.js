const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/simple_store.db",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Połączono z bazą danych SQLite.");
  } catch (error) {
    console.error("Błąd połączenia z bazą danych:", error);
  }
};

module.exports = { sequelize, connectDB };