const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }


  return res.status(403).json({ message: "Brak uprawnień (wymagany admin)" });
};

module.exports = { requireAdmin };