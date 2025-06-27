const Order = require('../models/order.model.js');
const Product = require('../models/product.model.js');

// 1. CREATE: Tạo một đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, totalPrice } = req.body;
    const order = new Order({
      orderItems,
      shippingInfo,
      totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};

// 2. GET SINGLE ORDER: Lấy chi tiết một đơn hàng theo ID
exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng với ID này' });
        }

        // --- KIỂM TRA QUYỀN TRUY CẬP ---
        // Cho phép nếu là admin hoặc nếu là chủ của đơn hàng
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xem đơn hàng này' });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin đơn hàng', error: error.message });
    }
};


// 3. GET MY ORDERS: Lấy các đơn hàng của người dùng đang đăng nhập
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
    }
};

// --- CÁC HÀM DÀNH CHO ADMIN ---

// 4. GET ALL ORDERS (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy tất cả đơn hàng', error: error.message });
  }
};

// 5. UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Hoàn thành') {
        order.deliveredAt = Date.now();
    }
    await order.save();
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn hàng', error: error.message });
  }
};