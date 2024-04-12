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

    const {
      name,
      email,
      dob,
      password,
      phone,
      address,
      bio,
      price,
      experience,
    } = req.body;

    if (typeof password === "undefined" || password === "") {
      return res.status(400).json({ error: "Password is required" });
    }

    // Construct the full URL for the image
    const image = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;

    const checkArtistQuery = "SELECT * FROM artist WHERE email = ?";
    database.query(checkArtistQuery, [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery =
        "INSERT INTO Artist (artist_Name, password, email, phone_Number, address, bio, DOB, image, price, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)";

      database.query(
        insertQuery,
        [
          name,
          hashedPassword,
          email,
          phone,
          address,
          bio,
          dob,
          image,
          price,
          experience,
        ],
        (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(200).json({ message: "Signup successful" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editArtistById = async (req, res) => {
  const { artistId } = req.params;
  const { artist_Name, phone_Number, email, address } = req.body;

  try {
    const updateQuery =
      "UPDATE artist SET artist_Name = ?, phone_Number = ?, email = ?, address = ? WHERE artist_Id = ?";
    database.query(
      updateQuery,
      [artist_Name, phone_Number, email, address, artistId],
      (err, result) => {
        if (err) {
          console.error("Error updating artist in the database:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Artist not found" });
        }

        console.log("Artist updated successfully");
        res.status(200).json({ message: "Artist updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error updating artist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteArtistById = async (req, res) => {
  const { artistId } = req.params;

  try {
    const deleteQuery = "DELETE FROM Artist WHERE artist_Id = ?";
    database.query(deleteQuery, [artistId], (err, result) => {
      if (err) {
        console.error("Error deleting artist from the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      console.log("Artist deleted successfully");
      res.status(200).json({ message: "Artist deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { artistSignup, editArtistById, deleteArtistById, upload };
