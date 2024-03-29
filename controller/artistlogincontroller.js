const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

const loginArtist = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const checkArtistQuery = "SELECT * FROM artist WHERE email = ?";
    database.query(checkArtistQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking artist:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Invalid credentials - Artist not found" });
      }

      const artist = results[0];

      const passwordMatch = await bcrypt.compare(password, artist.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: "Invalid credentials - Incorrect password" });
      }

      const token = jwt.sign(
        { artist_id: artist.artist_Id, email: email, name: artist.name },
        "your_secret_key", // Replace with your secure, environment-specific key
        { expiresIn: "1h" }
      );

      // Update the token in the database
      const storeTokenQuery = "UPDATE artist SET token = ? WHERE artist_Id = ?";
      database.query(
        storeTokenQuery,
        [token, artist.artist_Id],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Error storing token:", updateErr);
            return res
              .status(500)
              .json({ error: "Error storing authentication token" });
          }

          // Send the response back to the client
          res.status(200).json({
            artist_id: artist.artist_Id,
            token,
            message: "Login successful",
          });
        }
      );
    });
  } catch (error) {
    console.error("Error logging in artist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  loginArtist,
};
