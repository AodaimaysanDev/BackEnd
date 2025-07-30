const Appointment = require('../models/mysql_appointment.model');
const User = require('../models/mysql_user.model');
const { Op } = require('sequelize');

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
    const existed = await Appointment.findOne({ where: { date, time } });
    if (existed) {
      return res.status(400).json({ success: false, message: 'Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.' });
    }
    const appointment = await Appointment.create({
      userId: req.user.id,
      name,
      phone,
      date,
      time,
      note
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt lịch hẹn', error: error.message });
  }
};

// Admin xem tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ include: [{ model: User, attributes: ['name', 'email'] }] });
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
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    appointment.status = status;
    await appointment.save();
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái', error: error.message });
  }
};

// Admin xóa lịch hẹn
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    res.status(200).json({ success: true, message: 'Đã xóa lịch hẹn' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa lịch hẹn', error: error.message });
  }
};

// User xem lịch hẹn của mình
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { userId: req.user.id } });
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
    const existed = await Appointment.findOne({ where: { date, time, id: { [Op.ne]: id } } });
    if (existed) {
      return res.status(400).json({ success: false, message: 'Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.' });
    }
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    appointment.name = name;
    appointment.phone = phone;
    appointment.date = date;
    appointment.time = time;
    appointment.note = note;
    appointment.status = status;
    await appointment.save();
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi sửa lịch hẹn', error: error.message });
  }
}; 