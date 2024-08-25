const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const exerciseController = require("../controllers/exerciseController");

const router = express.Router();

router.get("/", authMiddleware, exerciseController.getExercise);
router.post("/", authMiddleware, exerciseController.postExercise);

module.exports = router;
