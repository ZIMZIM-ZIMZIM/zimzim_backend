const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const refreshMiddleware = require("../middleware/refreshMiddleware");

router.use("/", function (req, res, next) {
  console.log(`Request received at ${req.originalUrl}`);
  next();
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", refreshMiddleware);

module.exports = router;
