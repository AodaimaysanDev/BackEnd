const express = require('express');
const router = express.Router();
const productController = require('../controllers/mysql_product.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js');

// === CÁC ROUTE CÔNG KHAI (AI CŨNG CÓ THỂ TRUY CẬP) ===
// GET /api/products -> Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);
// GET /api/products/:id -> Lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// === CÁC ROUTE ĐƯỢC BẢO VỆ (CHỈ ADMIN MỚI CÓ THỂ TRUY CẬP) ===
// POST /api/products -> Tạo sản phẩm mới
router.post('/', protect, isAdmin, productController.createProduct);
// PUT /api/products/:id -> Cập nhật sản phẩm theo ID
router.put('/:id', protect, isAdmin, productController.updateProduct);
// DELETE /api/products/:id -> Xóa sản phẩm theo ID
router.delete('/:id', protect, isAdmin, productController.deleteProduct);

module.exports = router; 