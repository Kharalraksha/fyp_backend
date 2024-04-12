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
} = require("../controller/appointmentcontroller");
const { editAppointment } = require("../controller/editappointmentcontroller");
const {
  deleteAppointment,
} = require("../controller/deleteappointmentcontroller");

const appointmentroutes = express.Router();
appointmentroutes.post("/add", addappointment); // Assuming you want to handle POST requests to create appointments
appointmentroutes.get("/get", getappointments);
appointmentroutes.get("/:id", getAppointmentById);
appointmentroutes.put("/:appointment_Id", editAppointment);
appointmentroutes.delete("/:appointment_Id", deleteAppointment);
// Assuming your base URL is something like /api/appointments
appointmentroutes.get("/by-artist/:artistId", getAppointmentsByArtistId);
appointmentroutes.get("/getWithDetails", getAppointmentsWithDetails);
appointmentroutes.put("/reschedule/:appointmentId", rescheduleAppointment);
appointmentroutes.delete("/cancel/:appointmentId", cancelAppointment);

module.exports = appointmentroutes;
