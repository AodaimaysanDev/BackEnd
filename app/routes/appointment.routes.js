const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// User đặt lịch hẹn
router.post('/', protect, appointmentController.createAppointment);
// User xem lịch hẹn của mình
router.get('/my', protect, appointmentController.getMyAppointments);
// Admin xem tất cả lịch hẹn
router.get('/', protect, isAdmin, appointmentController.getAllAppointments);
// Admin xác nhận/hủy lịch hẹn
router.put('/:id/status', protect, isAdmin, appointmentController.updateAppointmentStatus);
// Admin xóa lịch hẹn
router.delete('/:id', protect, isAdmin, appointmentController.deleteAppointment);
// Admin sửa lịch hẹn
router.put('/:id', protect, isAdmin, appointmentController.editAppointment);

module.exports = router; 