const { validationResult } = require("express-validator");
const database = require("../connect/database");
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    // Use the original filename for the uploaded image
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

exports.addArtist = (req, res) => {
  const {
    artist_Name,
    phone_Number,
    email,
    address,
    bio,
    DOB,
    hashedpassword,
  } = req.body;

  // Handling potential validation errors from express-validator middleware if used
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if file is present in request
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  // Get the file path
  const imagePath = `http://localhost:3000/api/${req.file.path}`;

  const insertQuery = `
    INSERT INTO Artist(artist_Name, phone_Number, email, address, bio, DOB, image,password)
    VALUES (?, ?, ?, ?, ?, ?, ?,? )`;

  // Insert the image path into the database
  database.query(
    insertQuery,
    [
      artist_Name,
      phone_Number,
      email,
      address,
      bio,
      DOB,
      imagePath,
      hashedpassword,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting artist into the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Artist added successfully");
      res.status(201).json({
        message: "Artist added successfully",
        artistId: result.insertId,
        imagePath: imagePath,
      });
    }
  );
};

exports.getArtists = async (req, res) => {
  try {
    const query = "SELECT * FROM Artist";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching artists:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error in getArtists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getArtistsById = async (req, res) => {
  const { artistid } = req.params;
  console.log("artistid", artistid);
  try {
    const query = "SELECT * FROM artist WHERE artist_Id = ?";
    database.query(query, [artistid], (err, results) => {
      if (err) {
        console.error("Error fetching artist:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json(results[0]); // Assuming you want to return only the first result
    });
  } catch (error) {
    console.error("Error in getArtistsById:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Middleware to handle file uploads
exports.uploadImage = upload.single("image"); // 'image' should match the name attribute in the form field for image upload
