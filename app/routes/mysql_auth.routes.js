const express = require('express');
const router = express.Router();
const authController = require('../controllers/mysql_auth.controller.js');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router; 