const express = require("express");
const reportroute = express.Router();
const reportcontroller = require("../controller/reportcontroller");

// Route for generating the PDF report
reportroute.get("/report", reportcontroller.generateReport);

module.exports = reportroute;
