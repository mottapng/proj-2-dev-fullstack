const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Middleware de autenticação JWT exportado como `auth`
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios",
      error: "Validation error",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Email ou senha inválidos",
      error: "Invalid credentials",
    });
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(401).json({
      message: "Email ou senha inválidos",
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

module.exports = router;
module.exports.auth = authMiddleware;
