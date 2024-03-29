const { check } = require("express-validator");

const ValidateLogin = () => [
  check("email").isEmail().withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("Password is required"),
];

module.exports = ValidateLogin;
