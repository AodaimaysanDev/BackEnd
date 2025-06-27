const Order = require('../models/order.model.js');
const Product = require('../models/product.model.js');
const User = require('../models/user.model.js');

exports.getDashboardStats = async (req, res) => {
    try {
        // Đếm tổng số sản phẩm
        const productCount = await Product.countDocuments();
        
        // Đếm tổng số người dùng
        const userCount = await User.countDocuments();
        
        // Đếm số đơn hàng đang chờ xử lý hoặc đang giao
        const pendingOrdersCount = await Order.countDocuments({ 
            orderStatus: { $in: ['Đang xử lý', 'Đang giao hàng'] } 
        });

        // Sử dụng Aggregation Pipeline để tính tổng doanh thu từ các đơn hàng đã hoàn thành
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: 'Hoàn thành' } },
            { 
                $group: {
                    _id: null, // Nhóm tất cả lại thành một
                    totalRevenue: { $sum: '$totalPrice' } // Tính tổng của trường totalPrice
                } 
            }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            stats: {
                productCount,
                userCount,
                pendingOrdersCount,
                totalRevenue,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu thống kê',
            error: error.message,
        });
    }
};