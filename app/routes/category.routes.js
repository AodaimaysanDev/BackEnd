const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', protect, isAdmin, categoryController.createCategory);
router.put('/:id', protect, isAdmin, categoryController.updateCategory);
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = router;
