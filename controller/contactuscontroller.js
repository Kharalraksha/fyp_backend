const express = require("express");
const mysql = require("mysql");
const database = require("../connect/database");

// Route to add a new contact message
exports.addContactMessage = (req, res) => {
  const { name, address, phonenumber, message } = req.body;
  console.log("Request Body:", req.body);

  // Simple validation (you could use express-validator for more comprehensive validation)
  if (!name || !address || !phonenumber || !message) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  const insertQuery =
    "INSERT INTO contactus (name, address, phonenumber, message) VALUES (?, ?, ?, ?)";
  const values = [name, address, phonenumber, message];

  database.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting contact message:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({
      message: "Contact message submitted successfully.",
      contactId: result.insertId,
    });
  });
};
// Route to get all contact messages
exports.getContactMessages = (req, res) => {
  try {
    const query = "SELECT * FROM contactus";
    database.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching contact messages:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
