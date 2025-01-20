const { DataTypes } = require("sequelize");
const { sequelize }= require("../config/database");
const CartItem = sequelize.define("CartItem", {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
  
  module.exports = CartItem;