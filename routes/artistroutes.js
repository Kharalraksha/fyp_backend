const express = require("express");
// Fix the path
const ValidateArtist = require("../middleware/ValidateArtist");
const {
  addArtist,
  getArtistsById,
  uploadImage,
} = require("../controller/artistcontoller");
const { getArtists } = require("../controller/artistcontoller");
const { editArtist } = require("../controller/editartistcontroller");
const { deleteArtist } = require("../controller/deleteartistcontroller");
const {
  loginArtist,
  artistLogin,
} = require("../controller/artistlogincontroller");

const {
  artistSignup,
  upload,
} = require("../controller/artistsignupcontroller");

const artistroutes = express.Router();
//localhost:3000/api/signup
artistroutes.post(
  "/add",
  uploadImage,

  // Upload Middlware
  //  ValidateSignup(),
  addArtist
);
artistroutes.post("/loginartist", loginArtist);
artistroutes.post("/signupartist", upload.single("image"), artistSignup);
// List of attisy
artistroutes.get(
  "/get",
  //  ValidateSignup(),
  getArtists
);

// single artist using id
artistroutes.get(
  "/:artistid",
  //  ValidateSignup(),
  getArtistsById
);
// artistroutes.get("/:artistid", getArtistsById);

artistroutes.put("/editArtist", editArtist);
artistroutes.delete("/deleteArtist/:Id", deleteArtist);

module.exports = artistroutes;
