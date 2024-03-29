const express = require("express");

const { authenticateToken } = require("../middleware/authmiddleware");
const {
  addappointment,
  getappointments,
  getAppointmentById,
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
module.exports = appointmentroutes;
