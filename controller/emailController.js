// emailController.js
const nodemailer = require("nodemailer");

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "keyshawn81@ethereal.email",
    pass: "BeNcaQAYE6gEXrn24H",
  },
});

// Function to send appointment confirmation email
exports.sendAppointmentEmail = (userEmail, date, callback) => {
  const mailOptions = {
    from: "rakshyakharal0@gmail.com",
    to: userEmail,
    subject: "Appointment Confirmation",
    text: `Your appointment on ${date} has been successfully scheduled.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return callback(error);
    }
    console.log("Email sent: " + info.response);
    callback(null, info.response);
  });
};
