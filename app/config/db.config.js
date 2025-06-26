const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Lấy chuỗi kết nối từ biến môi trường
    const conn_str = process.env.MONGO_URI;

    // Tùy chọn kết nối để tránh các cảnh báo từ Mongoose
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    
    // Thực hiện kết nối đến MongoDB Atlas
    await mongoose.connect(conn_str, options);

    console.log('Kết nối thành công tới cơ sở dữ liệu MongoDB!');
  } catch (error) {
    console.error(`Lỗi kết nối CSDL: ${error.message}`);
    // Thoát khỏi tiến trình nếu không thể kết nối tới DB
    process.exit(1);
  }
};

module.exports = connectDB;