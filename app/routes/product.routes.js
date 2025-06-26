const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js'); // Import middleware

// === CÁC ROUTE CÔNG KHAI (AI CŨNG CÓ THỂ TRUY CẬP) ===
// GET /api/products -> Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// GET /api/products/:id -> Lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);


// === CÁC ROUTE ĐƯỢC BẢO VỆ (CHỈ ADMIN MỚI CÓ THỂ TRUY CẬP) ===
// Để truy cập các route bên dưới, client phải gửi kèm token JWT hợp lệ trong Header.

// POST /api/products -> Tạo sản phẩm mới
// Yêu cầu: Đã đăng nhập (protect) VÀ là admin (isAdmin)
router.post('/', protect, isAdmin, productController.createProduct);

// PUT /api/products/:id -> Cập nhật sản phẩm theo ID
router.put('/:id', protect, isAdmin, productController.updateProduct);

// DELETE /api/products/:id -> Xóa sản phẩm theo ID
router.delete('/:id', protect, isAdmin, productController.deleteProduct);

module.exports = router;
