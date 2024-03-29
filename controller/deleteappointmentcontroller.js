const database = require("../connect/database");

// Route to delete an appointment
exports.deleteAppointment = (req, res) => {
  const { appointment_Id } = req.params;

  // Delete the appointment
  const deleteQuery = "DELETE FROM Appointment WHERE appointment_Id = ?";
  database.query(deleteQuery, [appointment_Id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 1) {
      res.status(200).json({
        message: "Appointment has been deleted",
        data: {},
      });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  });
};
