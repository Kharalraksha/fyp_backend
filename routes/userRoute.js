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
} = require("../controller/signupcontroller");
const { deleteUser } = require("../controller/deleteusercontroller");
const { editUser } = require("../controller/editusercontroller");

const userRoutes = express.Router();
//localhost:3000/api/signup
userRoutes.post(
  "/signup",
  //  ValidateSignup(),
  addUser
);
userRoutes.get("/all", getUsers);

userRoutes.get("/:userid", getUsersById);
userRoutes.put("/editUser", editUser);
userRoutes.delete("/deleteUser/:Id", deleteUser);
// Route to edit an existing user
// userRoutes.put("/editUser", editUser);

// // Route to delete an existing user
// userRoutes.delete("/deleteUser", deleteUser);

userRoutes.post("/login", ValidateLogin(), loginUser);

module.exports = userRoutes;
