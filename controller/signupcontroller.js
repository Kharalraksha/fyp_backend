const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const database = require("../connect/database");

const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      // Make sure this matches your req.body property names
      name,
      email,
      dob,
      password, // Include password in the destructuring
      phone,
      address,
      gender,
    } = req.body;

    console.log("name", name);

    // Check if the email already exists
    const checkUserQuery = "SELECT * FROM user WHERE email = ?";
    database.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.json({ error: "Email already exists" });
      }

      // Use async version of bcrypt.hash
      const hashedPassword = await bcrypt.hash(password, 8);

      const insertQuery =
        "INSERT INTO user (user_Name, password, email, phone_number, gender, DOB, profile, roles, registration_Date, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const result = await database.query(insertQuery, [
        name,
        hashedPassword,
        email,
        phone,
        gender,
        dob,
        "profile",
        "user",
        new Date(),
        address,
      ]);

      console.log("User signed up successfully");
      res.status(200).json({ message: "Signup successful" });
    });
  } catch (error) {
    console.error("Error processing user signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.getUsers = async (req, res) => {
//   try {
//     const query = "SELECT * FROM user";
//     database.query(query, (err, results) => {
//       if (err) {
//         console.error("Error fetching user:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
//     res.status(200).json({ message: "Hello" });
//   } catch (error) {
//     console.error("Error in getUsers:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getUsers = async (req, res) => {
  try {
    const query = "SELECT * FROM user";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({ results });
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUsersById = async (req, res) => {
  const { userid } = req.params;
  console.log("userid", userid);
  try {
    const query = "SELECT * FROM user WHERE user_Id = ?";
    database.query(query, [userid], (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(results[0]); // Assuming you want to return only the first result
    });
  } catch (error) {
    console.error("Error in getUsersById:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      user_Name,
      email,
      phone_number,
      address,
      gender,
      DOB,
      profile,
      roles,
      registration_Date,
    } = req.body;

    const updateUserQuery = `
      UPDATE user 
      SET 
        user_Name = ?,
        email = ?,
        phone_number = ?,
        address = ?,
        gender = ?,
        DOB = ?,
        profile = ?,
        roles = ?,
        registration_Date = ?
      WHERE user_Id = ?`;

    const result = await database.query(updateUserQuery, [
      user_Name,
      email,
      phone_number,
      address,
      gender,
      DOB,
      profile,
      roles,
      registration_Date,
      id,
    ]);

    console.log("User updated successfully");
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM user WHERE user_Id = ?";
    database.query(deleteQuery, [id], (err, result) => {
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



module.exports = {
  addUser,
  getUsers,
  getUsersById,
  editUserById,
  deleteUserById,
};
