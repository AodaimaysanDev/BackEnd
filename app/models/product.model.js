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
    images: [{
      type: String,
      required: false, // Lưu trữ hình ảnh dưới dạng base64
      maxlength: [5000000, 'Kích thước hình ảnh quá lớn'], // Giới hạn kích thước cho base64
      validate: {
        validator: function(v) {
          // Simple validation to check if it's a base64 image
          return !v || v.startsWith('data:image');
        },
        message: props => `${props.value} không phải là định dạng hình ảnh hợp lệ!`
      }
    }],
    // Giữ lại imageUrl để backward compatibility, nhưng khuyến khích sử dụng mảng images
    imageUrl: {
      type: String,
      required: false, // Được giữ lại để tương thích với phiên bản cũ
      deprecated: true, // Đánh dấu là sẽ không được sử dụng trong tương lai
    },
    size: {
        type: [String],
        required: false,
    },
    color: {
        type: [String],
        required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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