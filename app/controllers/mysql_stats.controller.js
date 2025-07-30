const { Order } = require('../models/mysql_order.model');
const Product = require('../models/mysql_product.model');
const User = require('../models/mysql_user.model');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    // Đếm tổng số sản phẩm
    const productCount = await Product.count();
    // Đếm tổng số người dùng
    const userCount = await User.count();
    // Đếm số đơn hàng đang chờ xử lý hoặc đang giao
    const pendingOrdersCount = await Order.count({
      where: {
        orderStatus: { [Op.in]: ['Đang xử lý', 'Đang giao hàng'] },
      },
    });
    // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
    const revenueResult = await Order.findAll({
      where: { orderStatus: 'Hoàn thành' },
      attributes: [[Order.sequelize.fn('SUM', Order.sequelize.col('totalPrice')), 'totalRevenue']],
      raw: true,
    });
    const totalRevenue = revenueResult[0].totalRevenue || 0;
    res.status(200).json({
      success: true,
      stats: {
        productCount,
        userCount,
        pendingOrdersCount,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu thống kê',
      error: error.message,
    });
  }
}; 