const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/info", authMiddleware, function (req, res, next) {
  res.json({
    message: "user find success",
    data: req.user,
  });
});

router.post("/info", authMiddleware, userController.updateUserInfo);

module.exports = router;
