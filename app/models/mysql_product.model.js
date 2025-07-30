const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql.config');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên sản phẩm' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập mô tả sản phẩm' },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Giá sản phẩm không thể là số âm' },
    },
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArrayOfStrings(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('Images phải là một mảng');
        }
        if (value && value.some(item => typeof item !== 'string')) {
          throw new Error('Tất cả các URL hình ảnh phải là chuỗi');
        }
      }
    },
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue || [];
    },
    set(value) {
      // Ensure we always store an array, filter out empty strings
      const cleanValue = Array.isArray(value) ? value.filter(img => img && img.trim()) : [];
      this.setDataValue('images', cleanValue);
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập danh mục cho sản phẩm' },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Số lượng tồn kho không thể âm' },
    },
  },
}, {
  timestamps: true,
  tableName: 'products',
});

module.exports = Product; 