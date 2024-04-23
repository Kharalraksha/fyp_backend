const express = require("express");
const artistroutes = require("./artistroutes");
const userRoutes = require("./userRoute");
const signuproutes = require("./signuproutes");
const path = require("path");
const appointmentroutes = require("./appointmentroutes");
const timeslotroutes = require("./timeslotroutes");
const imageroutes = require("./imageroutes");
const contactroutes = require("./contactusroutes");
const paymentroutes = require("./paymentroutes");
const reviewroutes = require("./reviewroutes");
const chatbotroutes = require("./chatbotroutes");
const reportroute = require("./reportroute");


const mainroutes = express.Router();

mainroutes.use("/artist", artistroutes);
mainroutes.use("/user", userRoutes);
mainroutes.use("/appointment", appointmentroutes);
mainroutes.use("/timeslot", timeslotroutes);
mainroutes.use("/contact", contactroutes);
mainroutes.use("/payment", paymentroutes);
mainroutes.use("/review", reviewroutes);
mainroutes.use("/chat", chatbotroutes);
mainroutes.use("/admin", reportroute);

// mainroutes.use("/upload", imageroutes);
mainroutes.use("/uploads", express.static(path.join(__dirname, "../uploads")));
mainroutes.use(
  "/upload",
  imageroutes,
  express.static(path.join(__dirname, "../uploads"))
);

module.exports = mainroutes;
// C:\Users\Dell\Desktop\Glowquill_Database\uploads\artist3.jpg
