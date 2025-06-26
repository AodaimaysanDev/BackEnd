// ------------------------------------------------------------------
// FILE: app/middleware/auth.middleware.js
// MỤC ĐÍCH: Middleware để kiểm tra JWT và vai trò của người dùng.
// ------------------------------------------------------------------
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

// Middleware 1: Kiểm tra xem người dùng đã đăng nhập hay chưa (dựa vào token)
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tách lấy token từ header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy payload (chứa id người dùng)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm người dùng trong DB từ id trong token và gắn vào request
      // loại bỏ trường password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Người dùng không tồn tại.'});
      }

      // Chuyển sang middleware tiếp theo
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
  }
};

// Middleware 2: Kiểm tra xem người dùng có phải là Admin không
exports.isAdmin = (req, res, next) => {
  // Middleware này phải chạy SAU middleware 'protect', vì nó cần req.user
  if (req.user && req.user.role === 'admin') {
    next(); // Nếu là admin, cho phép đi tiếp
  } else {
    // Nếu không phải admin, trả về lỗi 403 Forbidden
    res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu vai trò Admin' });
  }
};