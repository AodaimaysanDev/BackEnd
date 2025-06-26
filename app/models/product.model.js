const mongoose = require('mongoose');

// Schema định nghĩa cấu trúc của một document trong collection 'products'.
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sản phẩm'],
      min: [0, 'Giá sản phẩm không thể là số âm'],
    },
    imageUrl: {
      type: String,
      required: false, // Không bắt buộc, có thể thêm sau
    },
    category: {
      type: String,
      required: [true, 'Vui lòng nhập danh mục cho sản phẩm'],
    },
    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng tồn kho'],
      min: [0, 'Số lượng tồn kho không thể âm'],
      default: 0,
    },
  },
  {
    // Tự động thêm hai trường: createdAt và updatedAt
    timestamps: true,
  }
);

// Tạo ra một Model từ Schema. Model này sẽ được dùng để tương tác với
// collection 'products' trong database.
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;