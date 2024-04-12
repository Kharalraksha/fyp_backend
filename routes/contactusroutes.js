const express = require("express");
const contactroutes = express.Router();
const contactcontroller = require("../controller/contactuscontroller");

contactroutes.post("/contact", contactcontroller.addContactMessage);
contactroutes.get("/contact", contactcontroller.getContactMessages);

module.exports = contactroutes;
