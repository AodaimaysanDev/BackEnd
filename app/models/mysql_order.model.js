const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql.config');
const User = require('./mysql_user.model');
const Product = require('./mysql_product.model');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingPhoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Chưa thanh toán',
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  orderStatus: {
    type: DataTypes.ENUM('Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'),
    allowNull: false,
    defaultValue: 'Đang xử lý',
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'order_items',
});

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { Order, OrderItem }; 