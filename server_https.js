require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./app/config/db.config');

connectDB();
const app = express();

app.use(cors({
  origin: [
    'https://aodaimaysancodinh.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
// Increase payload limit for handling base64 images
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng bạn đến với API của E-commerce Website!' });
});

// --- ĐĂNG KÝ ROUTES ---
const productRoutes = require('./app/routes/product.routes.js');
const authRoutes = require('./app/routes/auth.routes.js');
const orderRoutes = require('./app/routes/order.routes.js');
const statsRoutes = require('./app/routes/stats.routes.js');
const appointmentRoutes = require('./app/routes/appointment.routes.js');
const categoryRoutes = require('./app/routes/category.routes.js');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;

// Start HTTP server (for development)
http.createServer(app).listen(PORT, () => {
  console.log(`HTTP Server đang chạy trên cổng ${PORT}.`);
});

// Start HTTPS server (for production)
try {
  // Check if SSL certificates exist
  if (fs.existsSync('./ssl/cert.pem') && fs.existsSync('./ssl/key.pem')) {
    const httpsOptions = {
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem')
    };
    
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server đang chạy trên cổng ${HTTPS_PORT}.`);
    });
  } else {
    console.log('SSL certificates not found. HTTPS server not started.');
    console.log('Please generate SSL certificates or use a reverse proxy like nginx.');
  }
} catch (error) {
  console.error('Error starting HTTPS server:', error.message);
}
