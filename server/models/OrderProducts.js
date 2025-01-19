const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const OrderProducts = sequelize.define("OrderProducts", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = OrderProducts;