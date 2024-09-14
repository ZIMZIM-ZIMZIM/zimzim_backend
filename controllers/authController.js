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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ message: "success" });
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

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      data: {
        id: user.id,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({ message: "Logout successful" });
};
