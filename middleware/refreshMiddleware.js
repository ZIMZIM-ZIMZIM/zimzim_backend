const jwt = require("jsonwebtoken");

const refreshMiddleware = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "No refresh token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60,
    });
    return res.json({ token: newToken });
  } catch (error) {
    return res.status(403).json({ message: "Refresh token is not valid" });
  }
};

module.exports = refreshMiddleware;
