const { sequelize } = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const Review = require("./Review");
const Order = require("./Order");
const OrderProducts = require("./OrderProducts");

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.belongsToMany(Product, { through: OrderProducts, as: "products" });
Product.belongsToMany(Order, { through: OrderProducts, as: "orders" });

module.exports = {
  sequelize,
  User,
  Product,
  Review,
  Order,
  OrderProducts
};