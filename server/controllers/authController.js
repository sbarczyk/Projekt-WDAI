const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane" });
    }


    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPass,
      role: role || "user",
    });

    return res.status(201).json({ message: "Utworzono konto", user: { id: newUser.id, username: newUser.username, role: newUser.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Błędne dane logowania" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Błędne dane logowania" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Brak refresh tokenu" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      console.error("Błąd weryfikacji refresh tokenu:", err.message);
      return res.status(403).json({ message: "Błędny refresh token" });
    }
    const accessToken = generateAccessToken(decoded.id);
    return res.json({ accessToken });
  });
};


function generateAccessToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET nie jest ustawione!");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "30m",
  });
}


function generateRefreshToken(userId) {
  if (!process.env.REFRESH_SECRET) {
    throw new Error("REFRESH_SECRET nie jest ustawione!");
  }
  return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "2d",
  });
}

module.exports = { register, login, refresh };