const express = require("express");
const reviewroutes = express.Router();
const { body } = require("express-validator");
const reviewcontroller = require("../controller/reviewcontroller");

// Route to add a review
reviewroutes.post(
  "/add",
  [
    // Validation middleware for request body
    body("artist_Id").isInt().withMessage("Artist ID must be an integer"),
    body("user_Id").isInt().withMessage("User ID must be an integer"),
    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comments")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Comments cannot be empty"),
  ],
  reviewcontroller.addReview
);

// Route to get all reviews
reviewroutes.get("/all", reviewcontroller.getReviews);

// Route to get a review by ID
reviewroutes.get("/:id", reviewcontroller.getReviewById);
reviewroutes.get("/artist/:artist_Id", reviewcontroller.getReviewsByArtistId);
// Assuming your route looks something like "/api/reviews/artist/:artist_Id"

module.exports = reviewroutes;
