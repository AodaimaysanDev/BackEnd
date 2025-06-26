const Order = require('../models/order.model.js');
const Product = require('../models/product.model.js');

// 1. CREATE: Tạo một đơn hàng mới (cho người dùng đã đăng nhập)
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, totalPrice } = req.body;
    
    // req.user được gắn vào từ middleware 'protect'
    const order = new Order({
      orderItems,
      shippingInfo,
      totalPrice,
      user: req.user._id, // Lấy id của người dùng đang đăng nhập
    });

    const createdOrder = await order.save();
    
    // (Tùy chọn) Cập nhật lại số lượng tồn kho của sản phẩm
    // ...

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message,
    });
  }
};

// 2. GET: Lấy các đơn hàng của người dùng đang đăng nhập
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách đơn hàng',
            error: error.message,
        });
    }
};

// --- CÁC HÀM DÀNH CHO ADMIN ---

// 3. GET: Lấy tất cả các đơn hàng (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email'); // Lấy thêm tên và email của user
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy tất cả đơn hàng',
      error: error.message,
    });
  }
};

// 4. UPDATE: Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    // (Thêm logic kiểm tra nếu đơn hàng đã được giao thì không cho cập nhật)

    order.orderStatus = req.body.status;
    if (req.body.status === 'Hoàn thành') {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đơn hàng',
      error: error.message,
    });
  }
};
