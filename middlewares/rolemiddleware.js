const roleMidlleware = (role) => (req, res, next) => {
  if (role.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource.",
    });
  }
};

module.exports = roleMidlleware
