require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("mongo-sanitize");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");
const logger = require("./config/logger");

const authRoutes = require("./routes/auth");
const moviesRoutes = require("./routes/movies");

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rate limiter básico (100 requisições por 15 minutos)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Middleware de sanitização MongoDB - Previne injeção NoSQL
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  if (req.params) req.params = mongoSanitize(req.params);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);

app.use((err, req, res, next) => {
  logger.error("Erro não tratado", err);
  res.status(500).json({ message: "Erro no servidor" });
});

const PORT = process.env.PORT || 8000;
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    logger.error("Falha ao iniciar aplicação", err);
    process.exit(1);
  }
})();
