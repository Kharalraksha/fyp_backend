const express = require("express");
const chatbotroutes = express.Router();
const chatbotcontroller = require("../controller/chatbotcontroller");

const { body } = require("express-validator");

chatbotroutes.post(
  "/messages",
  [
    body("SessionID").not().isEmpty().withMessage("SessionID is required."),
    body("SenderType").not().isEmpty().withMessage("SenderType is required."),
    body("MessageText").not().isEmpty().withMessage("MessageText is required."),
  ],
  chatbotcontroller.addMessage
);

// More routes can be added here if needed, such as update or delete operations

module.exports = chatbotroutes;
