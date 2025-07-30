const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql.config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Vui lòng nhập một địa chỉ email hợp lệ' },
      notEmpty: { msg: 'Vui lòng nhập email' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Mật khẩu phải có ít nhất 6 ký tự',
      },
    },
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin'),
    defaultValue: 'customer',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
}, {
  timestamps: true,
  tableName: 'users',
});

module.exports = User; 