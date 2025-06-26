require('dotenv').config();
const express = require('express');
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
const authRoutes = require('./app/routes/auth.routes.js'); // <-- Import auth routes

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // <-- Sử dụng auth routes


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}.`);
});
