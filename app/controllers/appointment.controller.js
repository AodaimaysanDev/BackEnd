const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');

// User đặt lịch hẹn
exports.createAppointment = async (req, res) => {
  try {
    const { name, phone, date, time, note } = req.body;
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