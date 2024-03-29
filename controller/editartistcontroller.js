// Update the information of an artist
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

exports.editArtist = async (req, res) => {
  const { artist_Id, artist_Name, phone_Number, email, address } = req.body;

  try {
    const updateQuery =
      "UPDATE Artist SET artist_Name = ?, phone_Number = ?, email = ?, address = ? WHERE artist_Id = ?";
    database.query(
      updateQuery,
      [artist_Name, phone_Number, email, address, artist_Id],
      (err, result) => {
        if (err) {
          console.error("Error updating artist in the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        console.log("Update Result:", result);

        console.log("Artist updated successfully");
        res.status(200).json({ message: "Artist updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error updating artist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
