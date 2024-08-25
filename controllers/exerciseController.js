const Exercise = require("../schema/Exercise");
const User = require("../schema/User");

exports.postExercise = async (req, res) => {
  try {
    const { userId, date, duration, type, force } = req.body;

    const user = await User.find({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exercise = new Exercise({
      date,
      duration,
      type,
      force,
      user: user[0]._id,
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Error adding exercise", error });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const { startDate, endDate, id } = req.query;

    const user = await User.find({ id: id });

    const exercises = await Exercise.find({
      user: user[0]._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: "No exercises found for this date range" });
    }

    res.json({ data: exercises });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises", error });
  }
};
