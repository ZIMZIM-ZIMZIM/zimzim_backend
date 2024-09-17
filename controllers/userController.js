const User = require("../schema/User");

exports.updateUserInfo = async (req, res) => {
  try {
    const { nickname, height, weight } = req.body;

    const userId = req.user.id;
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (nickname) user.nickname = nickname;
    if (height) user.height = height;
    if (weight) user.weight = weight;

    await user.save();

    return res.status(200).json({
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update user information", error });
  }
};
