const jwt = require("jsonwebtoken");
const User = require("../schema/User");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: decoded.id });
    req.user = user;

    next();
  } catch (error) {
    console.log(error, "error");
    res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
