// imageRoutes.js
const express = require("express");
const imageroutes = express.Router();
const upload = require("../middleware/upload");
const imagecontroller = require("../controller/imagecontroller");

// Backend route configuration
imageroutes.post("/upload", imagecontroller.uploadImages);

imageroutes.get("/uploadphoto/:Id", imagecontroller.getImagesByArtistId);
imageroutes.get("/get", imagecontroller.getartistimages);

module.exports = imageroutes;
