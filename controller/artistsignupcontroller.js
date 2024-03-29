const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { validationResult } = require("express-validator");
const database = require("../connect/database");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = "uploads/";
    fs.mkdirSync(uploadsDir, { recursive: true }); // Ensure directory exists
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const artistSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, dob, password, phone, address, bio } = req.body;
    console.log("Password received:", password); // Log to verify the password

    // Proceed only if the password is defined and not empty
    if (typeof password === "undefined" || password === "") {
      return res.status(400).json({ error: "Password is required" });
    }

    const image = req.file ? req.file.path : null;

    // Check if the artist's email already exists
    const checkArtistQuery = "SELECT * FROM artist WHERE email = ?";
    database.query(checkArtistQuery, [email], async (error, results) => {
      if (error) {
        console.error("Error checking artist:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery =
        "INSERT INTO Artist (artist_Name, password, email, phone_Number, address, bio, DOB, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      database.query(
        insertQuery,
        [name, hashedPassword, email, phone, address, bio, dob, image],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error("Error signing up artist:", insertErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(200).json({ message: "Signup successful" });
        }
      );
    });
  } catch (error) {
    console.error("Error processing artist signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { artistSignup, upload };
