const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/user");
const logger = require("../config/logger");
const tokenBlacklist = require("../config/tokenBlacklist");

const router = express.Router();

// Rate limiter específico para login (proteção contra brute force)
// 5 tentativas por 15 minutos por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
});

// Middleware de autenticação JWT exportado como `auth`
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  
  // Verifica se o token está na blacklist (logout)
  if (tokenBlacklist.has(token)) {
    logger.warn("Falha na autenticação: token na blacklist");
    return res.status(401).json({ message: "Token invalidated" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    logger.warn("Falha na autenticação: token inválido", { error: err.message });
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios",
      error: "Validation error",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("Falha na autenticação: usuário não encontrado", { email });
    return res.status(401).json({
      message: "Email ou senha inválidos",
      error: "Invalid credentials",
    });
  }

  const match = await user.comparePassword(password);
  if (!match) {
    logger.warn("Falha na autenticação: senha inválida", { email, userId: user._id });
    return res.status(401).json({
      message: "Email ou senha inválidos",
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  logger.info("Usuário autenticado com sucesso", { email, userId: user._id });

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

/**
 * Endpoint de logout
 * Invalida o token atual adicionando-o à blacklist
 */
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader.split(" ")[1];
    
    // Decodifica o token para obter a data de expiração
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      // Adiciona à blacklist até a data de expiração
      const expiresAt = decoded.exp * 1000; // Converte para milissegundos
      tokenBlacklist.add(token, expiresAt);
      logger.info("Usuário fez logout", { email: req.user.email, userId: req.user.id });
    }
    
    return res.json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    logger.error("Erro ao fazer logout", err);
    return res.status(500).json({ message: "Erro ao realizar logout" });
  }
});

module.exports = router;
module.exports.auth = authMiddleware;
