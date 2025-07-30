const express = require('express');
const router = express.Router();
const statsController = require('../controllers/mysql_stats.controller.js');
const { protect, isAdmin } = require('../middleware/auth.middleware.js');

// GET /api/stats -> Lấy dữ liệu thống kê cho dashboard (chỉ admin)
router.get('/', protect, isAdmin, statsController.getDashboardStats);

module.exports = router; 