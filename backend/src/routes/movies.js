const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Movie = require("../models/movie");
const { auth } = require("../routes/auth");
const logger = require("../config/logger");
const cache = require("../config/cache");

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

      // Constrói filtros de busca
      const filters = {};

      // Gera chave de cache baseada nos parâmetros de busca
      const cacheKey = cache.generateKey("movies_search", req.query);

      // Verifica cache antes de buscar no banco
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        logger.info("Cache hit na busca de filmes", { query: req.query });
        return res.json({ results: cachedResult, cached: true });
      }

      // Se uma query de texto completo fornecida, usa busca de texto do MongoDB (schema tem índice de texto)
      if (req.query.query) {
        const q = req.query.query;
        const userEmail = (req.user && req.user.email) || "anonymous";
        logger.info(`Usuário ${userEmail} buscando filmes`, { query: q });

        const movies = await Movie.find(
          { $text: { $search: q } },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(100);

        // Armazena no cache por 5 minutos
        cache.set(cacheKey, movies, 5 * 60 * 1000);
        return res.json({ results: movies });
      }

      if (req.query.year) filters.year = Number(req.query.year);
      if (req.query.genre) filters.genre = req.query.genre;
      if (req.query.title) filters.title = new RegExp(req.query.title, "i");

      const userEmail = (req.user && req.user.email) || "anonymous";
      logger.info(`Usuário ${userEmail} buscando filmes`, { filters });

      const movies = await Movie.find(filters).limit(100);

      // Armazena no cache por 5 minutos
      cache.set(cacheKey, movies, 5 * 60 * 1000);
      return res.json({ results: movies });
    } catch (err) {
      logger.error("Erro na busca", err);
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

      const data = {
        title: req.body.title,
        year: Number(req.body.year),
        genre: req.body.genre,
        director: req.body.director,
        rating: Number(req.body.rating),
        description: req.body.description,
      };

      const movie = new Movie(data);
      await movie.save();

      // Limpa o cache de buscas quando um novo filme é adicionado
      cache.clear();

      logger.info(`Usuário ${req.user.email} criou filme ${movie._id}`);
      return res.status(201).json({ movie });
    } catch (err) {
      logger.error("Erro ao inserir filme", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

module.exports = router;
