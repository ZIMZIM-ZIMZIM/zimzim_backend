const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const waterController = require("../controllers/waterController");

const router = express.Router();

router.get("/", authMiddleware, waterController.getWaterList);
router.post("/", authMiddleware, waterController.postWater);
router.post("/:id", authMiddleware, waterController.updateWater);

module.exports = router;
