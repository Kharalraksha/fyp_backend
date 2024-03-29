const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, "your_secret_key");
    const user_Id = decodedToken.user_id;
    req.user = user_Id; // Attach user ID to the request object
    next();
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { authenticateToken };
