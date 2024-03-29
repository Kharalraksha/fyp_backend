const multer = require("multer");
const upload = require("../middleware/upload");
const database = require("../connect/database");

// Note: Removed the imagePath require since it conflicts with your local variable

exports.uploadImages = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ message: "Multer error", error: err.toString() });
    } else if (err) {
      return res
        .status(500)
        .json({ message: "Unknown error", error: err.toString() });
    }

    // Check for no files uploaded or no artist_id
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload files" });
    }

    // Validate artist_id is present
    if (!req.body.artist_Id) {
      return res.status(400).json({ message: "Artist ID is required" });
    }

    // Prepare file paths and artist_ids for insertion
    const values = req.files.map((file) => {
      const imagePath = `http://localhost:3000/uploads/${file.filename}`; // Adjust path as needed
      return [imagePath, req.body.artist_Id];
    });

    // Using MySQL's bulk insert syntax
    const query = `INSERT INTO image (image_url, artist_id) VALUES ?`;

    // Execute the query
    database.query(query, [values], (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Database error", error: error.toString() });
      }
      res.status(201).json({
        message: "Files uploaded and database updated successfully",
        data: results,
      });
    });
  });
};

exports.getartistimages = (req, res) => {
  try {
    const query = "SELECT * FROM image";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching appointments:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getImagesByArtistId = (req, res) => {
  console.log(req.params); // Debugging line to see incoming params

  // Make sure to match the parameter name as defined in your route (/:Id)
  const artist_Id = req.params.Id;

  if (!artist_Id) {
    return res.status(400).send({ message: "Artist ID is required" });
  }

  const query = "SELECT * FROM image WHERE artist_Id = ?";

  database.query(query, [artist_Id], (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Database error", error });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No images found for the given artist ID" });
    }
    // Assuming you want to return the results directly
    res.status(200).send({
      message: "Images fetched successfully",
      data: results,
    });
  });
};
