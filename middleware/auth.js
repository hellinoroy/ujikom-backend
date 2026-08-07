const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = { verifyToken, verifyRole };