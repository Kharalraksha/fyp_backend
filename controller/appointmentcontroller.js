const { validationResult } = require("express-validator");
const database = require("../connect/database");
const moment = require("moment");

// Route to add an appointment
exports.addappointment = (req, res) => {
  let { status, date, artist_Id, user_Id, timeslot_Id } = req.body;
  console.log("Request Body:", req.body);
  console.log("Date:", date);

  // Validate date format
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  // Check if user with user_Id exists

  console.log("Checking existence for user_Id:", user_Id);
  // Check if user with user_Id exists
  database.query(
    "SELECT * FROM user WHERE user_Id = ?",
    [user_Id],
    (userErr, userResults) => {
      if (userErr) {
        console.error("Error querying user:", userErr);
        return res.status(500).json({ error: "Internal Server Error" });
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

          // If both user and artist exist, insert appointment
          const insertQuery =
            "INSERT INTO Appointment (status, date, artist_id, user_id, timeslot_id) VALUES (?, ?, ?, ?, ?)";
          const values = [status, date, artist_Id, user_Id, timeslot_Id];

          database.query(insertQuery, values, (insertErr, result) => {
            if (insertErr) {
              console.error("Error inserting appointment:", insertErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            res.status(201).json({
              message: "Appointment has been set successfully.",
              appointmentId: result.insertId,
            });
          });
        }
      );
    }
  );
};

// Route to get all appointments remains the same.
exports.getappointments = (req, res) => {
  try {
    const query = "SELECT * FROM Appointment";
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
exports.getAppointmentById = (req, res) => {
  const { id } = req.params; // Extract appointment ID from request parameters
  const query = "SELECT * FROM Appointment WHERE appointment_Id = ?";

  // Query the database to retrieve the appointment
  database.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result[0]); // Return the appointment data
  });
};
exports.getAppointmentsByArtistId = (req, res) => {
  const { artistId } = req.params; // Ensure you're capturing the artistId correctly

  const query = `
    SELECT 
      Appointment.*,
      user_Name AS userName,
      user.email AS userEmail
    FROM 
      Appointment
    JOIN 
      User ON Appointment.user_Id = User.user_Id
    WHERE 
      Appointment.artist_Id = ?;
  `;

  database.query(query, [artistId], (err, results) => {
    if (err) {
      console.error("Error fetching appointments with user details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this artist." });
    }

    res.json(results);
  });
};
exports.getAppointmentsWithDetails = (req, res) => {
  try {
    const query = `
      SELECT 
    Appointment.*,
    user.user_Name AS userName,
    user.email AS userEmail,
    Artist.artist_Name AS artistName,
    Artist.email AS artistEmail
FROM 
    Appointment
JOIN 
    User ON Appointment.user_Id = User.user_Id
JOIN
    Artist ON Appointment.artist_Id = Artist.artist_Id;

    `;
    database.query(query, (err, results) => {
      if (err) {
        console.error(
          "Error fetching appointments with user and artist details:",
          err
        );
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error(
      "Error fetching appointments with user and artist details:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// PUT route for rescheduling an appointment
exports.rescheduleAppointment = (req, res) => {
  const { appointmentId } = req.params; // Make sure you're extracting appointmentId from the URL parameters correctly
  const { newDate, newTimeslotId } = req.body; // Extract both newDate and newTimeslotId from the request body

  // Trim and validate the newDate
  const trimmedDate = newDate.trim();
  if (!moment(trimmedDate, "YYYY-MM-DD", true).isValid()) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use 'YYYY-MM-DD'." });
  }

  // Prepare and execute the query to update the appointment's date and timeslot
  const updateQuery =
    "UPDATE Appointment SET date = ?, timeslot_id = ? WHERE appointment_Id = ?";
  database.query(
    updateQuery,
    [trimmedDate, newTimeslotId, appointmentId],
    (err, result) => {
      if (err) {
        console.error("Error updating appointment:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        // If no rows are affected, it means the appointment was not found
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.json({ message: "Appointment rescheduled successfully" });
    }
  );
};

// DELETE route for canceling an appointment
exports.cancelAppointment = (req, res) => {
  const { appointmentId } = req.params;

  const cancelQuery =
    "UPDATE Appointment SET status = 'canceled' WHERE appointment_Id = ?";

  database.query(cancelQuery, [appointmentId], (err, result) => {
    if (err) {
      console.error("Error canceling appointment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment canceled successfully" });
  });
};
