// ------------------------------------------------------------------
// FILE: app/models/user.model.js
// MỤC ĐÍCH: Định nghĩa cấu trúc cho User.
// ------------------------------------------------------------------
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true, // Đảm bảo mỗi email là duy nhất
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vui lòng nhập một địa chỉ email hợp lệ',
    ],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], // Chỉ cho phép hai giá trị này
    default: 'customer', // Mặc định người dùng mới là khách hàng
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;