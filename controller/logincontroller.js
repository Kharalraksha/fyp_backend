const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

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

  // Check if the user is an admin based on fixed admin credentials
  if (email === "admin@example.com" && password === "adminpassword") {
    const admin = {
      user_Id: 0, // Set a unique ID for admin
      email: "admin@example.com",
      role: "admin",
    };

    // Generate JWT token for admin
    const token = jwt.sign(
      { userId: admin.user_Id, email: admin.email, role: admin.role },
      "your_secret_key", // Replace 'your_secret_key' with your actual secret key
      { expiresIn: "1h" }
    );

    // Set token in a cookie as an example (adjust according to your security requirements)
    res.cookie("jwt", token, { httpOnly: true });

    // Respond with the token and user details (excluding the password for security reasons)
    return res.status(200).json({
      message: "Admin login successful",
      token,
      userDetails: {
        userId: admin.user_Id,
        email: admin.email,
        role: admin.role,
      },
    });
  }

  // Check if the user is a regular user
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

    // Check if the provided password matches the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid credentials - Incorrect password" });
    }

    // Generate JWT token for regular user
    const token = jwt.sign(
      { userId: user.user_Id, email: user.email, role: "user" },
      "your_secret_key", // Replace 'your_secret_key' with your actual secret key
      { expiresIn: "1h" }
    );

    // Set token in a cookie as an example (adjust according to your security requirements)
    res.cookie("jwt", token, { httpOnly: true });

    // Respond with the token and user details (excluding the password for security reasons)
    res.status(200).json({
      message: "User login successful",
      token,
      userDetails: {
        userId: user.user_Id,
        email: user.email,
        role: "user",
      },
    });
  });
};

module.exports = { loginUser };
