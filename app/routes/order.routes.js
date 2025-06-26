const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js');

// === Route cho người dùng đã đăng nhập ===
// POST /api/orders -> Tạo đơn hàng mới
router.post('/', protect, orderController.createOrder);
// GET /api/orders/myorders -> Lấy đơn hàng của tôi
router.get('/myorders', protect, orderController.getMyOrders);


// === Routes chỉ dành cho Admin ===
// GET /api/orders -> Lấy tất cả đơn hàng
router.get('/', protect, isAdmin, orderController.getAllOrders);
// PUT /api/orders/:id -> Cập nhật trạng thái đơn hàng
router.put('/:id', protect, isAdmin, orderController.updateOrderStatus);


module.exports = router;