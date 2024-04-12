const express = require("express");
const database = require("../connect/database");

/// Route to add a new payment
exports.addPayment = (req, res) => {
  const { user_Id, appointment_Id, amount, details } = req.body;

  // Check if user with user_Id exists
  database.query(
    "SELECT * FROM user WHERE user_Id = ?",
    [user_Id],
    (userErr, userResults) => {
      if (userErr) {
        console.error("Error querying user:", userErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if appointment with appointment_Id exists
      database.query(
        "SELECT * FROM Appointment WHERE appointment_Id = ?",
        [appointment_Id],
        (appointmentErr, appointmentResults) => {
          if (appointmentErr) {
            console.error("Error querying appointment:", appointmentErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (userResults.length === 0) {
            return res.status(400).json({ error: "User does not exist" });
          }

          if (appointmentResults.length === 0) {
            return res
              .status(400)
              .json({ error: "Appointment does not exist" });
          }

          // If both user and appointment exist, insert payment
          const insertQuery =
            "INSERT INTO payment (user_Id, appointment_Id, amount, details) VALUES (?, ?, ?, ?)";
          const values = [user_Id, appointment_Id, amount, details];

          database.query(insertQuery, values, (insertErr, result) => {
            if (insertErr) {
              console.error("Error inserting payment:", insertErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            res.status(201).json({
              message: "Payment submitted successfully.",
              payment_Id: result.insertId,
            });
          });
        }
      );
    }
  );
};

// Route to get all payments
exports.getPayments = (req, res) => {
  try {
    const query = "SELECT * FROM payment";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching payments:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to edit a payment
exports.editPayment = (req, res) => {
  const { paymentId } = req.params;
  const { user_id, appointment_id, amount, details } = req.body;

  // Simple validation (you could use express-validator for more comprehensive validation)

  const updateQuery =
    "UPDATE payment SET user_Id = ?, appointment_Id = ?, amount = ?, details = ? WHERE payment_Id = ?";
  const values = [user_id, appointment_id, amount, details, paymentId];

  database.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating payment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "Payment updated successfully." });
  });
};

// Route to delete a payment
exports.deletePayment = (req, res) => {
  const { payment_id } = req.params;

  const deleteQuery = "DELETE FROM payment WHERE payment_Id = ?";
  const values = [payment_id];

  database.query(deleteQuery, values, (err, result) => {
    if (err) {
      console.error("Error deleting payment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "Payment deleted successfully." });
  });
};
// Route to get a payment by ID
exports.getPaymentById = (req, res) => {
  const { payment_id } = req.params;

  const query = "SELECT * FROM payment WHERE payment_Id = ?";
  const values = [payment_id];

  database.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching payment by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(result[0]); // Assuming only one payment is expected with the provided ID
  });
};
