const User = require("../schema/User");
const Water = require("../schema/Water");

exports.getWaterList = async (req, res) => {
  try {
    const userId = req.user.id;
    const waterList = await Water.find({ user: userId }).sort({ date: -1 });

    if (!waterList) {
      return res.status(404).json({ message: "No water records found" });
    }

    res.status(200).json(waterList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching water list", error });
  }
};

exports.postWater = async (req, res) => {
  try {
    const { date, amount } = req.body;
    const userId = req.user.id;

    const newWaterRecord = new Water({
      date,
      amount,
      user: userId,
    });

    const savedWaterRecord = await newWaterRecord.save();

    res.status(201).json(savedWaterRecord);
  } catch (error) {
    res.status(500).json({ message: "Error adding water record", error });
  }
};

exports.updateWater = async (req, res) => {
  try {
    const waterId = req.params.id;
    const { date, amount } = req.body;

    const updatedWater = await Water.findByIdAndUpdate(
      waterId,
      { date, amount },
      { new: true, runValidators: true }
    );

    if (!updatedWater) {
      return res.status(404).json({ message: "Water record not found" });
    }

    res.status(200).json(updatedWater);
  } catch (error) {
    res.status(500).json({ message: "Error updating water record", error });
  }
};
