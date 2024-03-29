// Delete an artist

const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const database = require("../connect/database");

exports.deleteArtist = async (req, res) => {
  const { Id } = req.params;

  console.log("artist id, ", Id);

  try {
    const deleteQuery = "DELETE FROM Artist WHERE artist_Id = ?";
    database.query(deleteQuery, [Id], (err, result) => {
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
