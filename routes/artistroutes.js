const express = require("express");
// Fix the path
const ValidateArtist = require("../middleware/ValidateArtist");
const {
  addArtist,
  getArtistsById,
  uploadImage,
} = require("../controller/artistcontoller");
const { getArtists } = require("../controller/artistcontoller");

const { deleteArtist } = require("../controller/deleteartistcontroller");
const {
  loginArtist,
  artistLogin,
} = require("../controller/artistlogincontroller");

const {
  artistSignup,
  upload,
  editArtistById,
  deleteArtistById,
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

artistroutes.put("/editArtist/:artistId", editArtistById);
artistroutes.delete("/deleteArtist/:artistId", deleteArtistById);


module.exports = artistroutes;
