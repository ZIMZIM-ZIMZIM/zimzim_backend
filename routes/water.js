const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const waterController = require("../controllers/waterController");

const router = express.Router();

router.get("/", authMiddleware, waterController.getTotalWaterAmountInPeriod);
router.get("/list", authMiddleware, waterController.getWaterList);
router.post("/", authMiddleware, waterController.postWater);
router.post("/:id", authMiddleware, waterController.updateWater);
router.delete("/:id", authMiddleware, waterController.deleteWaterRecord);

module.exports = router;
