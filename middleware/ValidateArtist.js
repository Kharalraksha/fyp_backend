// ValidateArtist.js
const { check } = require("express-validator");

const ValidateArtist = () => [
  check("artist_Id").notEmpty().withMessage("Id is required"),
  check("artist_Name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("phone_Number").notEmpty().withMessage("Phone is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("bio").notEmpty().withMessage("bio is required"),
];

module.exports = ValidateArtist;
