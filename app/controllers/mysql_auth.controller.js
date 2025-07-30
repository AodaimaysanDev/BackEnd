const User = require('../models/mysql_user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// 1. REGISTER: Đăng ký người dùng mới
exports.register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email này đã được sử dụng.' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username này đã được sử dụng.' });
      }
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
    });

    // Không trả về mật khẩu trong response
    const userResponse = { ...newUser.get() };
    delete userResponse.password;

    res.status(201).json({ message: 'Đăng ký thành công!', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng ký', error: error.message });
  }
};

// 2. LOGIN: Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng bằng email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Nếu mật khẩu khớp, tạo JWT
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Không trả về mật khẩu trong response
    const userResponse = { ...user.get() };
    delete userResponse.password;

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi đăng nhập', error: error.message });
  }
}; 