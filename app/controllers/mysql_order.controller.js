const { Order, OrderItem } = require('../models/mysql_order.model');
const User = require('../models/mysql_user.model');
const Product = require('../models/mysql_product.model');

// 1. CREATE: Tạo một đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, shippingCity, shippingPhoneNo, paymentId, paymentStatus, totalPrice } = req.body;
    // Tạo đơn hàng
    const order = await Order.create({
      userId: req.user.id,
      shippingAddress,
      shippingCity,
      shippingPhoneNo,
      paymentId,
      paymentStatus,
      totalPrice,
    });
    // Tạo các order item
    if (orderItems && Array.isArray(orderItems)) {
      for (const item of orderItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }
    const createdOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'orderItems' }] });
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};

// 2. GET SINGLE ORDER: Lấy chi tiết một đơn hàng theo ID
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: OrderItem, as: 'orderItems', include: [{ model: Product }] },
      ],
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng với ID này' });
    }
    // Kiểm tra quyền truy cập
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
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
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'orderItems' }],
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
  }
};

// 4. GET ALL ORDERS (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: OrderItem, as: 'orderItems' },
      ],
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy tất cả đơn hàng', error: error.message });
  }
};

// 5. UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Hoàn thành') {
      order.deliveredAt = new Date();
    }
    await order.save();
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn hàng', error: error.message });
  }
}; 