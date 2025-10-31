const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = req.user || {};
    req.user.id = decoded.userId;
    req.user.name = decoded.name;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
