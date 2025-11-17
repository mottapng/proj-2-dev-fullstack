const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Movie = require("../models/movie");
const { auth } = require("../routes/auth");
const mongoSanitize = require("mongo-sanitize");
const logger = require("../config/logger");

const router = express.Router();
// GET /api/movies?query=...&year=...&genre=...
// Busca: apenas para usuarios autenticados
router.get(
  "/",
  auth,
  [
    query("query").optional().isString(),
    query("year").optional().isInt(),
    query("genre").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // sanitize and build search
      const filters = {};
      // If a full-text query is provided, use MongoDB text search (schema has text index)
      if (req.query.query) {
        const q = mongoSanitize(req.query.query);
        const userEmail = (req.user && req.user.email) || 'anonymous';
        logger.info(`User ${userEmail} searching movies`, { query: q });

        const movies = await Movie.find(
          { $text: { $search: q } },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(100);

        return res.json({ results: movies });
      }

      if (req.query.year) filters.year = Number(mongoSanitize(req.query.year));
      if (req.query.genre) filters.genre = mongoSanitize(req.query.genre);
      if (req.query.title)
        filters.title = new RegExp(mongoSanitize(req.query.title), "i");

      const userEmail = (req.user && req.user.email) || 'anonymous';
      logger.info(`User ${userEmail} searching movies`, { filters });

      const movies = await Movie.find(filters).limit(100);
      return res.json({ results: movies });
    } catch (err) {
      logger.error("Search error", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

// POST /api/movies
// Insercao: apenas para usuarios autenticados
router.post(
  "/",
  auth,
  [
    body("title").isString().notEmpty(),
    body("year").isInt({ min: 1888 }).withMessage("Ano inválido"),
    body("genre").isString().notEmpty(),
    body("director").isString().notEmpty(),
    body("rating").isFloat({ min: 0, max: 10 }),
    body("description").isString().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // sanitize body
      const data = {
        title: mongoSanitize(req.body.title),
        year: Number(mongoSanitize(req.body.year)),
        genre: mongoSanitize(req.body.genre),
        director: mongoSanitize(req.body.director),
        rating: Number(mongoSanitize(req.body.rating)),
        description: mongoSanitize(req.body.description),
      };

      const movie = new Movie(data);
      await movie.save();

      logger.info(`User ${req.user.email} created movie ${movie._id}`);
      return res.status(201).json({ movie });
    } catch (err) {
      logger.error("Insert error", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

module.exports = router;
