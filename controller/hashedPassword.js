// hashPassword.js
const bcrypt = require("bcrypt");

const passwordToHash = "yourAdminPassword"; // REPLACE with the actual password you want to hash

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
    // Use the output hashed password to manually update your database
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

hashPassword(passwordToHash);
