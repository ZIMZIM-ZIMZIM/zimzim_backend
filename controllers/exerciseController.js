const Exercise = require("../schema/Exercise");
const User = require("../schema/User");

exports.postExercise = async (req, res) => {
  try {
    const { userId, date, totalDuration, detail, isPT } = req.body;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let exercise = await Exercise.findOne({ user: user._id, date });

    if (exercise) {
      exercise.totalDuration =
        parseFloat(totalDuration) + parseFloat(exercise.totalDuration);
      exercise.detail.push(...detail);
      await exercise.save();
    } else {
      exercise = new Exercise({
        date,
        totalDuration,
        detail,
        user: user._id,
        isPT,
      });
      await exercise.save();
    }

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Error adding exercise", error });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const { startDate, endDate, id } = req.query;

    const user = await User.find({ id: id });

    let query = { user: user[0]._id };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.date = {
          $gte: start,
          $lte: end,
        };
      } else {
        return res.status(400).json({ message: "Invalid date format" });
      }
    }

    const exercises = await Exercise.find(query).sort({ date: -1 });
    res.json({ data: exercises });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises", error });
  }
};

exports.getExerciseList = async (req, res) => {
  try {
    const id = req.query.id;

    const user = await User.findOne({ id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalItems = await Exercise.countDocuments({ user: user._id });
    const totalPages = Math.ceil(totalItems / 10);

    const page = Math.max(
      0,
      Math.min(parseInt(req.query.page, 10) || 0, totalPages - 1)
    );
    const limit = 10;
    const skipValue = page * limit;

    const items = await Exercise.find({ user: user._id })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skipValue);

    res.json({
      data: {
        totalItems,
        totalPages,
        currentPage: page,
        items,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMultipleExerciseDetails = async (req, res) => {
  try {
    const { exerciseDetails } = req.body;

    if (!exerciseDetails || !Array.isArray(exerciseDetails)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    for (const exerciseDetail of exerciseDetails) {
      const { exerciseId, detailIds } = exerciseDetail;

      const exercise = await Exercise.findById(exerciseId);

      if (!exercise) {
        return res
          .status(404)
          .json({ message: `Exercise with id ${exerciseId} not found` });
      }

      exercise.detail = exercise.detail.filter(
        (detail) => !detailIds.includes(detail._id.toString())
      );

      console.log(exercise, "kkk");
      if (exercise.detail.length === 0) {
        await Exercise.findByIdAndDelete(exerciseId);
      } else {
        await exercise.save();
      }
    }

    res.status(200).json({ message: "Details deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting details", error });
  }
};

exports.deleteAllExercises = async (req, res) => {
  try {
    await Exercise.deleteMany({});

    res.status(200).json({ message: "All exercises have been deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exercises", error });
  }
};
