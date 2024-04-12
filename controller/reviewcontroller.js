const { validationResult } = require("express-validator");
const database = require("../connect/database");

// Route to add a review
exports.addReview = (req, res) => {
  // Extract fields from request body
  const { artist_Id, user_Id, rating, comments } = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if artist with artist_Id exists
  database.query(
    "SELECT * FROM artist WHERE artist_Id = ?",
    [artist_Id],
    (artistErr, artistResults) => {
      if (artistErr) {
        console.error("Error querying artist:", artistErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (artistResults.length === 0) {
        return res.status(400).json({ error: "Artist does not exist" });
      }

      // Check if user with user_Id exists
      database.query(
        "SELECT * FROM user WHERE user_Id = ?",
        [user_Id],
        (userErr, userResults) => {
          if (userErr) {
            console.error("Error querying user:", userErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (userResults.length === 0) {
            return res.status(400).json({ error: "User does not exist" });
          }

          // Insert review into database
          const insertQuery =
            "INSERT INTO review (artist_Id, user_Id, rating, comments) VALUES (?, ?, ?, ?)";
          const values = [artist_Id, user_Id, rating, comments];

          database.query(insertQuery, values, (insertErr, result) => {
            if (insertErr) {
              console.error("Error inserting review:", insertErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            res.status(201).json({
              message: "Review has been added successfully.",
              reviewId: result.insertId,
            });
          });
        }
      );
    }
  );
};

// Route to get all reviews remains the same.
exports.getReviews = (req, res) => {
  try {
    const query = "SELECT * FROM review";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching reviews:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to get a review by ID remains the same.
exports.getReviewById = (req, res) => {
  const { id } = req.params; // Extract review ID from request parameters
  const query = "SELECT * FROM review WHERE review_Id = ?";

  // Query the database to retrieve the review
  database.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching review by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(result[0]); // Return the review data
  });
};
// Route to get reviews by artist ID
exports.getReviewsByArtistId = (req, res) => {
  const { artist_Id } = req.params; // Use the correct param name as per your route setup

  database.query(
    "SELECT * FROM review WHERE artist_Id = ?",
    [artist_Id],
    (err, results) => {
      if (err) {
        console.error("Error fetching reviews by artist ID:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    }
  );
};
