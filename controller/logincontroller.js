const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Check if the user is an admin based on fixed admin credentials
  if (email === "admin@gmail.com" && password === "adminpassword") {
    const admin = {
      email: "admin@gmail.com",
      role: "admin",
    };

    // Generate JWT token for admin
    const token = jwt.sign(
      { email: admin.email, role: admin.role },
      "your_secret_key", // Replace 'your_secret_key' with your actual secret key
      { expiresIn: "1h" }
    );

    // Set token in a cookie as an example (adjust according to your security requirements)
    res.cookie("jwt", token, { httpOnly: true });

    // Respond with the token, user details, and isAdmin flag
    return res.status(200).json({
      message: "Admin login successful",
      token,
      userDetails: admin,
      isAdmin: true, // Add isAdmin flag for admin user
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

    // Respond with the token, user details, and isAdmin flag (set to false for regular users)
    res.status(200).json({
      message: "User login successful",
      token,
      userDetails: {
        userId: user.user_Id,
        email: user.email,
        role: "user",
      },
      isAdmin: false, // Add isAdmin flag for regular user
    });
  });
};

module.exports = { loginUser };
