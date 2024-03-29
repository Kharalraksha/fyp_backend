const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

// const loginUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;
//   const checkUserQuery = "SELECT * FROM user WHERE email = ?";

//   database.query(checkUserQuery, [email], async (err, results) => {
//     if (err) {
//       console.error("Error checking user:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (results.length === 0) {
//       return res
//         .status(401)
//         .json({ error: "Invalid credentials - User not found" });
//     }

//     const user = results[0];

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res
//         .status(401)
//         .json({ error: "Invalid credentials - Incorrect password" });
//     }

//     // Replace 'your_secret_key' with your actual JWT secret key.
//     // It is crucial to keep this key secure and not expose it in your code for production environments.
//     const token = jwt.sign(
//       { userId: user.user_Id, email: user.email, name: user.user_name },
//       "your_secret_key",
//       { expiresIn: "1h" }
//     );

//     // The recommendation is to not store the JWT in your database unless absolutely necessary.
//     // Instead, send it back to the client to manage (e.g., via cookies or local storage).

//     res.cookie("jwt", token, { httpOnly: true }); // You might adjust cookie options based on security requirements

//     // Respond with the token and any other relevant user information (excluding sensitive information like passwords).
//     // Backend Code Snippet
//     // ...
//     res
//       .status(200)
//       .json({ token, user_Id: user.user_Id, message: "Login successful" }); // Ensure this matches the database column case.
//   });
// };

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const checkUserQuery = "SELECT * FROM user WHERE email = ?";

  database.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid credentials - User not found" });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid credentials - Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_Id, email: user.email, name: user.user_name },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    // Store token in the database
    const storeTokenQuery = "UPDATE user SET token = ? WHERE user_Id = ?";
    database.query(storeTokenQuery, [token, user.user_Id], (err) => {
      if (err) {
        console.error("Error storing token:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Set token in cookie
      res.cookie("jwt", token, { httpOnly: true }); // Adjust cookie options based on security requirements

      // Respond with token and user information
      res
        .status(200)
        .json({ token, user_Id: user.user_Id, message: "Login successful" });
    });
  });
};

module.exports = { loginUser };
