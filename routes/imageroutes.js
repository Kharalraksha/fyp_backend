// imageRoutes.js
const express = require("express");
const imageroutes = express.Router();
const upload = require("../middleware/upload");
const imagecontroller = require("../controller/imagecontroller");

imageroutes.post("/upload", imagecontroller.uploadImages);
imageroutes.get("/upload/:Id", imagecontroller.getImagesByArtistId);
imageroutes.get("/get", imagecontroller.getartistimages);

module.exports = imageroutes;
