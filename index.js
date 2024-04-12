const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const database = require("./connect/database");
const UserSignup = require("./routes/signuproutes");
const UserLogin = require("./routes/userRoute");
const userRoutes = require("./routes/userRoute");
const mainroutes = require("./routes/mainroutes");
const paymentroutes = require("./routes/paymentroutes");

const cors = require("cors");
const app = express();

app.use(cors());
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.use(express.json());
const port = 3000;

app.use(bodyParser.json());

//localhost:3000/api
app.use("/api", mainroutes);

app.use("/api", paymentroutes); // Adjust the base URL path '/api' as needed
app.use("/uploads", express.static("uploads"));

// app.use(UserSignup);
// app.use(UserLogin);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
