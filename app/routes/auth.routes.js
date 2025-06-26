// ------------------------------------------------------------------
// FILE: app/routes/auth.routes.js
// MỤC ĐÍCH: Định nghĩa các endpoint cho xác thực.
// ------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;