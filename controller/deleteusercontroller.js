const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

exports.deleteUser = async (req, res) => {
  const { Id } = req.params;

  console.log("user id, ", Id);

  try {
    const deleteQuery = "DELETE FROM user WHERE user_Id = ?";
    database.query(deleteQuery, [Id], (err, result) => {
      if (err) {
        console.error("Error deleting user from the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      console.log("User deleted successfully");
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
