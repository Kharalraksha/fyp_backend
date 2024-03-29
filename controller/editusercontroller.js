const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

exports.editUser = async (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { user_ID, name, email, dob, password, phone_number, address, gender } =
    req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

    const updateQuery =
      "UPDATE user SET user_Name = ?, password = ?, email = ?, phone_number = ?, gender = ?, DOB = ?, address = ? WHERE user_Id = ?";
    database.query(
      updateQuery,
      [
        name,
        hashedPassword,
        email,
        phone_number,
        gender,
        dob,
        address,
        user_ID,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating user in the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        console.log("Update Result:", result);

        console.log("User updated successfully");
        res.status(200).json({ message: "User updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
