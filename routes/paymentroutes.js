const express = require("express");
const router = express.Router();
const {
  addPayment,
  getPayments,
  editPayment,
  deletePayment,
  getPaymentById,
} = require("../controller/paymentcontroller");
const { authenticateToken } = require("../middleware/authmiddleware");

// Apply the authenticateToken middleware to routes that require authentication
router.post("/add", addPayment);
router.get("/get", getPayments);
router.put("/edit/:payment_id", editPayment); // Assuming PUT for editing
router.delete("/delete/:payment_id", deletePayment);
router.get("/get/:payment_id", getPaymentById);
module.exports = router;
