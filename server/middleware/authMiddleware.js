const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async (req, res, next) => {
  let token;


  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Brak nagłówka autoryzacji" });
  }


  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).json({ message: "Brak tokenu w nagłówku" });
  }

  try {

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET nie jest ustawione w pliku .env!");
      return res.status(500).json({ message: "Błąd konfiguracji serwera" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Nieautoryzowany (użytkownik nie znaleziony)" });
    }


    req.user = user;
    return next();
  } catch (error) {
    console.error("Błąd weryfikacji tokenu:", error.message);
    return res.status(401).json({ 
      message: "Nieautoryzowany (błędny token)",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { protect };