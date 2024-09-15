const User = require("../schema/User");
const Water = require("../schema/Water");

exports.getWaterList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ id: userId });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const waterList = await Water.find({ id: user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Water.countDocuments({ id: user._id });

    res.status(200).json({
      data: {
        item: waterList,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching water list", error });
  }
};

exports.getTotalWaterAmountInPeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ id: userId });

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const query = {
      id: user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const waterRecords = await Water.find(query);

    const totalWaterAmount = await Water.aggregate([
      { $match: query },
      {
        $addFields: {
          amount: { $toDouble: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      data: { totalWaterAmount: totalWaterAmount[0]?.totalAmount || 0 },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating total water amount", error });
  }
};

exports.postWater = async (req, res) => {
  try {
    const { date, amount } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ id: userId });

    const newWaterRecord = new Water({
      date,
      amount,
      id: user._id,
    });

    const savedWaterRecord = await newWaterRecord.save();

    res.status(201).json({ data: savedWaterRecord });
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

    res.status(200).json({ data: updatedWater });
  } catch (error) {
    res.status(500).json({ message: "Error updating water record", error });
  }
};

exports.deleteWaterRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: "No water record ID provided" });
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedRecord = await Water.findOneAndDelete({
      _id: id,
    });

    if (!deletedRecord) {
      return res.status(404).json({ message: "Water record not found" });
    }

    res.status(200).json({
      message: "Water record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting water record", error });
  }
};
