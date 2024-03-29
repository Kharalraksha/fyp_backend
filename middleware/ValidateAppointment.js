const { check } = require("express-validator");

const ValidateAppointment = () => [
  check("appointment_Id").notEmpty().withMessage("Id is required"),
  check("status").notEmpty().withMessage("status is required"),
  check("date").isEmail().withMessage("Invalid date format"),
  check("user_id").notEmpty().withMessage("user id is required"),
  check("artist_id").notEmpty().withMessage("artist id is required"),
];

module.exports = ValidateAppointment;
