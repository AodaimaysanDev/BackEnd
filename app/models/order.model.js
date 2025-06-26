const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    // Liên kết với người dùng đã đặt hàng
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu đến model 'User'
      required: true,
    },
    // Danh sách các sản phẩm trong đơn hàng
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product', // Tham chiếu đến model 'Product'
          required: true,
        },
      },
    ],
    // Thông tin giao hàng
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phoneNo: { type: String, required: true },
    },
    // Thông tin thanh toán
    paymentInfo: {
        id: { type: String }, // ID từ cổng thanh toán (nếu có)
        status: { type: String, default: 'Chưa thanh toán' },
    },
    // Tổng giá trị đơn hàng
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Trạng thái của đơn hàng
    orderStatus: {
      type: String,
      required: true,
      enum: ['Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'],
      default: 'Đang xử lý',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;