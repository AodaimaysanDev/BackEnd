require('dotenv').config();
const express = require('express');
const serverless = require("serverless-http");
const cors = require('cors');
const connectDB = require('./app/config/db.config');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với API của E-commerce Website!' });
});

// --- ĐĂNG KÝ ROUTES ---
const productRoutes = require('./app/routes/product.routes.js');
const authRoutes = require('./app/routes/auth.routes.js');
const orderRoutes = require('./app/routes/order.routes.js');
const statsRoutes = require('./app/routes/stats.routes.js'); // <-- Import stats routes

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes); // <-- Sử dụng stats routes


module.exports.handler = serverless(app);