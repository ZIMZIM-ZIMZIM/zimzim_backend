const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const exerciseController = require("../controllers/exerciseController");

const router = express.Router();

router.get("/", authMiddleware, exerciseController.getExercise);
router.post("/", authMiddleware, exerciseController.postExercise);
router.get("/list", authMiddleware, exerciseController.getExerciseList);
router.post("/details", exerciseController.deleteMultipleExerciseDetails);

module.exports = router;
