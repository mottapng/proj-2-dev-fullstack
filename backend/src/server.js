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

// Basic rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Simple request sanitizer middleware
app.use((req, res, next) => {
  if (req.body) req.body = JSON.parse(JSON.stringify(req.body));
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);

app.use((err, req, res, next) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ message: "Erro no servidor" });
});

const PORT = process.env.PORT || 8000;
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error("Failed to start app", err);
    process.exit(1);
  }
})();
