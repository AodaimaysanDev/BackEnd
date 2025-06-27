// ------------------------------------------------------------------
// FILE: app/controllers/auth.controller.js
// MỤC ĐÍCH: Chứa logic xử lý đăng ký và đăng nhập.
// ------------------------------------------------------------------
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER: Đăng ký người dùng mới
exports.register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username này đã được sử dụng.'});
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10); // Tạo một "muối" để tăng cường bảo mật
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    
    // Không trả về mật khẩu trong response
    const userResponse = { ...savedUser._doc };
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' }); // 401 Unauthorized
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Nếu mật khẩu khớp, tạo JWT
    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };
    
    // Ký token với một "secret key" và đặt thời gian hết hạn
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token sẽ hết hạn sau 1 ngày
    });

    // Không trả về mật khẩu trong response
    const userResponse = { ...user._doc };
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