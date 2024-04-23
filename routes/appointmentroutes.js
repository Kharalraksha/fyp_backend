const express = require("express");

const { authenticateToken } = require("../middleware/authmiddleware");
const {
  addappointment,
  getappointments,
  getAppointmentById,
  getAppointmentsByArtistId,
  getAppointmentsByUserArtistId,
  getAppointmentsWithDetails,
  rescheduleAppointment,
  cancelAppointment,
  getWeeklyAppointmentCounts,
  getMonthlyAppointmentCounts,
  getTotalAppointmentCount,
  getUserAppointments,
  getAppointmentsByUserId,
  cancelAppointments,
  cancelAppointmentByUser,
} = require("../controller/appointmentcontroller");
const { editAppointment } = require("../controller/editappointmentcontroller");
const {
  deleteAppointment,
} = require("../controller/deleteappointmentcontroller");

const appointmentroutes = express.Router();
appointmentroutes.post("/add", addappointment); // Assuming you want to handle POST requests to create appointments
appointmentroutes.get("/get", getappointments);
appointmentroutes.get("/get/:id", getAppointmentById);
appointmentroutes.put("/:appointment_Id", editAppointment);
appointmentroutes.delete("/:appointment_Id", deleteAppointment);
// Assuming your base URL is something like /api/appointments
appointmentroutes.get("/by-artist/:artistId", getAppointmentsByArtistId);
appointmentroutes.get("/getWithDetails", getAppointmentsWithDetails);
appointmentroutes.put("/reschedule/:appointmentId", rescheduleAppointment);
appointmentroutes.delete("/cancel/:appointmentId", cancelAppointment);
appointmentroutes.delete("/user/:appointmentId", cancelAppointmentByUser);
appointmentroutes.get("/weekly/:artistId", getWeeklyAppointmentCounts);
appointmentroutes.get("/monthly/:artistId", getMonthlyAppointmentCounts);
appointmentroutes.get("/total/:artistId", getTotalAppointmentCount);
appointmentroutes.get("/by-user/:userId", getAppointmentsByUserId);

module.exports = appointmentroutes;
