const { validationResult } = require("express-validator");
const database = require("../connect/database");

// Add a new timeslot
exports.addTimeslot = (req, res) => {
  const { date, available_time, artistId } = req.body;
  // Prepare values for batch insert
  const values = available_time.map((time) => [date, time, artistId]);

  const insertQuery = `
    INSERT INTO timeslot(date, available_time, artist_id)
    VALUES ?`;

  // Note the use of `values` directly in the query call
  database.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error("Error adding timeslot:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Timeslot(s) added successfully");
    res.status(201).json({
      message: "Timeslot(s) added successfully",
      affectedRows: result.affectedRows,
    });
  });
};

// Get all timeslots
exports.getAllTimeslots = (req, res) => {
  const query = "SELECT * FROM timeslot";

  // Execute the query
  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching timeslots:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
};

exports.getTimeslotsByArtistId = (req, res) => {
  // Log to check the received artist_Id
  console.log("Received artist_Id:", req.params.artist_Id);

  const { artist_Id } = req.params;

  if (!artist_Id) {
    console.log("Artist ID not provided");
    return res.status(400).json({ error: "Artist ID is required" });
  }

  const query = "SELECT * FROM timeslot WHERE artist_id = ?";

  // Execute the query
  database.query(query, [artist_Id], (err, results) => {
    if (err) {
      console.error("Error fetching timeslots by artist id:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log to check the query results
    console.log(`Query results for artist ID ${artist_Id}:`, results);

    // Respond based on the results
    if (results.length > 0) {
      res.json(results);
    } else {
      // If no results found, respond appropriately
      console.log(`No timeslots found for artist ID ${artist_Id}`);
      res
        .status(404)
        .json({ message: "No timeslots found for the given artist ID" });
    }
  });
};

// Update timeslot status
exports.updateTimeslotStatus = (req, res) => {
  const { timeslot_Id } = req.params;
  const { status } = req.body;

  const updateQuery = "UPDATE timeslot SET status = ? WHERE id = ?";

  // Execute the query
  database.query(updateQuery, [status, timeslot_Id], (err, result) => {
    if (err) {
      console.error("Error updating timeslot status:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Timeslot not found" });
    }

    console.log("Timeslot status updated successfully");
    res.json({ message: "Timeslot status updated successfully" });
  });
};

// Delete timeslot by id
exports.deleteTimeslot = (req, res) => {
  const { timeslotId } = req.params;
  const deleteQuery = "DELETE FROM timeslot WHERE id = ?";

  // Execute the query
  database.query(deleteQuery, [timeslotId], (err, result) => {
    if (err) {
      console.error("Error deleting timeslot:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Timeslot not found" });
    }

    console.log("Timeslot deleted successfully");
    res.json({ message: "Timeslot deleted successfully" });
  });
};
