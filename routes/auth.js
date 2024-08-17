const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.use("/", function (req, res, next) {
  console.log(`Request received at ${req.originalUrl}`);
  next();
});

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
