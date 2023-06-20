require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsConfig = require("./config/corsConfig");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const taskRoute = require("./routes/taskRoutes");
const authRoute = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors(corsConfig));
app.use(express.json());

const mongoConnect = async function () {
  try {
    await mongoose.connect(process.env.DATABASE_URI); //connect to database
  } catch (err) {
    console.log(err);
  }
};

mongoConnect();

// app.use("/login", authRoute);
app.use("/user", userRoute);
app.use("/task", taskRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
