require("dotenv").config();
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const https = require("https");

const privateKey = fs.readFileSync(
  path.join(__dirname, "localhost-key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "localhost.pem"),
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

const cors = require("cors");

const exerciseRouter = require("./routes/exercise");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const waterRouter = require("./routes/water");

mongoose
  .connect(process.env.MONGO_DB_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/exercise", exerciseRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/water", waterRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`HTTPS Server is running on https://localhost:${port}`);
});

module.exports = app;
