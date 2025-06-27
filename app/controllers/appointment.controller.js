const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');

// User đặt lịch hẹn
exports.createAppointment = async (req, res) => {
  try {
    const { name, phone, date, time, note } = req.body;
    // Chỉ cho phép các giờ chẵn hoặc 30 phút
    const allowedTimes = [];
    for (let h = 8; h <= 20; h++) {
      allowedTimes.push(`${h.toString().padStart(2, '0')}:00`);
      allowedTimes.push(`${h.toString().padStart(2, '0')}:30`);
    }
    if (!allowedTimes.includes(time)) {
      return res.status(400).json({ success: false, message: 'Chỉ được chọn các mốc giờ chẵn hoặc 30 phút (VD: 8:00, 8:30, ...)' });
    }
    // Kiểm tra trùng lịch (cùng ngày, cùng giờ)
    const existed = await Appointment.findOne({ date, time });
    if (existed) {
      return res.status(400).json({ success: false, message: 'Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.' });
    }
    const appointment = new Appointment({
      user: req.user._id,
      name,
      phone,
      date,
      time,
      note
    });
    await appointment.save();
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt lịch hẹn', error: error.message });
  }
};

// Admin xem tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user', 'name email');
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách lịch hẹn', error: error.message });
  }
};

// Admin xác nhận/hủy lịch hẹn
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái', error: error.message });
  }
};

// Admin xóa lịch hẹn
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Đã xóa lịch hẹn' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa lịch hẹn', error: error.message });
  }
};

// User xem lịch hẹn của mình
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch hẹn', error: error.message });
  }
};

// Admin sửa lịch hẹn
exports.editAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, date, time, note, status } = req.body;
    // Chỉ cho phép các giờ chẵn hoặc 30 phút
    const allowedTimes = [];
    for (let h = 8; h <= 20; h++) {
      allowedTimes.push(`${h.toString().padStart(2, '0')}:00`);
      allowedTimes.push(`${h.toString().padStart(2, '0')}:30`);
    }
    if (!allowedTimes.includes(time)) {
      return res.status(400).json({ success: false, message: 'Chỉ được chọn các mốc giờ chẵn hoặc 30 phút (VD: 8:00, 8:30, ...)' });
    }
    // Kiểm tra trùng lịch (cùng ngày, cùng giờ, trừ chính lịch này)
    const existed = await Appointment.findOne({ date, time, _id: { $ne: id } });
    if (existed) {
      return res.status(400).json({ success: false, message: 'Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.' });
    }
    const appointment = await Appointment.findByIdAndUpdate(id, { name, phone, date, time, note, status }, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi sửa lịch hẹn', error: error.message });
  }
}; 