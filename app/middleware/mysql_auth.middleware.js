const jwt = require('jsonwebtoken');
const User = require('../models/mysql_user.model.js');

// Middleware 1: Kiểm tra xem người dùng đã đăng nhập hay chưa (dựa vào token)
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Tìm người dùng trong DB từ id trong token và gắn vào request, loại bỏ trường password
      const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại.' });
      }
      req.user = user;
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
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu vai trò Admin' });
  }
}; 