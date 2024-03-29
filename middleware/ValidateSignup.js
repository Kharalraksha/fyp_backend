const { body, param, check, validationResult } = require("express-validator");

const ValidateSignup = () => [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("dob").notEmpty().withMessage("Date of birth is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("phone").notEmpty().withMessage("Phone is required"),
  check("address").notEmpty().withMessage("Address is required"),
];

module.exports = ValidateSignup;
