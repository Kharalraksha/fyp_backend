const express = require("express");
const timeslotroutes = express.Router();
const timeslotcontroller = require("../controller/timeslotcontroller");

// Route to add a new timeslot
timeslotroutes.post("/add", timeslotcontroller.addTimeslot);

// Route to get all timeslots
timeslotroutes.get("/get", timeslotcontroller.getAllTimeslots);

// Route to get timeslots by artist id
timeslotroutes.get("/:artist_Id", timeslotcontroller.getTimeslotsByArtistId);

// Route to delete timeslot by id
timeslotroutes.delete("/:timeslotId/delete", timeslotcontroller.deleteTimeslot);

module.exports = timeslotroutes;
