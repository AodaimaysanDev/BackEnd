const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js');

// Route cho người dùng đã đăng nhập
router.post('/', protect, orderController.createOrder);
router.get('/myorders', protect, orderController.getMyOrders);
// --- ROUTE MỚI ---
// Route này phải đặt trước các route có tham số khác nếu có thể gây xung đột
// Nó được bảo vệ bởi 'protect' -> chỉ user đăng nhập mới vào được
router.get('/:id', protect, orderController.getSingleOrder); 

// Routes chỉ dành cho Admin
router.get('/', protect, isAdmin, orderController.getAllOrders); // Chú ý: Route này nên là '/all' để tránh xung đột
router.put('/:id', protect, isAdmin, orderController.updateOrderStatus);

module.exports = router;