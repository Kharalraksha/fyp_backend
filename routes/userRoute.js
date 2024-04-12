const express = require("express");

// Fix the path
const ValidateLogin = require("../middleware/ValidateLogin");
const ValidateSignup = require("../middleware/ValidateSignup");
const ValidateArtist = require("../middleware/ValidateArtist");
const { loginUser } = require("../controller/logincontroller");
const {
  addUser,
  getUsers,
  getUsersById,
  editUserById,
  deleteUser,
  deleteUserById,
} = require("../controller/signupcontroller");

const userRoutes = express.Router();
//localhost:3000/api/signup
userRoutes.post(
  "/signup",
  //  ValidateSignup(),
  addUser
);
userRoutes.get("/all", getUsers);

userRoutes.get("/:userid", getUsersById);

userRoutes.put("/editUser/:id", editUserById);
userRoutes.delete("/deleteUser/:id", deleteUserById);

userRoutes.post("/login", ValidateLogin(), loginUser);

module.exports = userRoutes;
