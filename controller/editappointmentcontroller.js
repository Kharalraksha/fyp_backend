const database = require("../connect/database");

// Route to edit an appointment
exports.editAppointment = (req, res) => {
  const { appointment_Id } = req.params;
  const { status, date, artist_Id, user_Id, timeslot_Id } = req.body;

  // Update the appointment
  const updateQuery =
    "UPDATE Appointment SET status = ?, date = ?, artist_id = ?, user_id = ?, timeslot_id = ? WHERE appointment_Id = ?";
  const values = [
    status,
    date,
    artist_Id,
    user_Id,
    timeslot_Id,
    appointment_Id,
  ];

  database.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 1) {
      res.status(200).json({
        message: "Appointment has been updated",
        data: {},
      });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  });
};
