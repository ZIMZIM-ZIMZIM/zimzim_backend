const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const exerciseController = require("../controllers/exerciseController");

const router = express.Router();

router.get("/", authMiddleware, exerciseController.getExercise);
router.post("/", authMiddleware, exerciseController.postExercise);
router.delete("/", exerciseController.deleteAllExercises);
router.get("/list", authMiddleware, exerciseController.getExerciseList);
router.get("/detail/:id", authMiddleware, exerciseController.getExerciseDetail);
router.post(
  "/detail/:id",
  authMiddleware,
  exerciseController.updateExerciseDetail
);
router.post("/details", exerciseController.deleteMultipleExerciseDetails);

module.exports = router;
