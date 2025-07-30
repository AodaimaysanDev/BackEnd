require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./app/config/mysql.config');

// Kết nối MySQL
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối MySQL thành công!');
    await sequelize.sync(); // Tự động tạo bảng nếu chưa có
  } catch (error) {
    console.error('Không thể kết nối MySQL:', error);
  }
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với API của E-commerce Website!' });
});

// --- ĐĂNG KÝ ROUTES ---
const productRoutes = require('./app/routes/mysql_product.routes.js');
const authRoutes = require('./app/routes/mysql_auth.routes.js');
const orderRoutes = require('./app/routes/mysql_order.routes.js');
const statsRoutes = require('./app/routes/mysql_stats.routes.js');
const appointmentRoutes = require('./app/routes/mysql_appointment.routes.js');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}.`);
}); 