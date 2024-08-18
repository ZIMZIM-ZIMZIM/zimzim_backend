const User = require("../schema/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { id, nickname, password } = req.body;

  const user = new User({
    id,
    nickname,
    password,
  });

  try {
    await user.save();

    return res.json({
      id,
      nickname,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(401).json({ message: "Invalid id or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid id or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({
      id: user.id,
      nickname: user.nickname,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
