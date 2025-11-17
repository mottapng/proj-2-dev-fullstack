import axios from "axios";

/**
 * Configuração base do axios para comunicação com a API
 * Define a URL base e configura interceptors para adicionar token automaticamente
 */

// URL base da API - ajuste conforme necessário
// Usa a variável VITE_API_URL quando definida (recomendado),
// caso contrário aponta para o backend rodando em 8000.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Cria instância do axios com configuração base
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor para adicionar token de autenticação automaticamente em todas as requisições
 * O token é obtido do localStorage
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratar erros de resposta
 * Pode ser expandido para tratar erros específicos (401, 403, etc.)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros pode ser adicionado aqui
    return Promise.reject(error);
  }
);

/**
 * Função para realizar login
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} Promise com os dados de resposta (token, user)
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

/**
 * Função para realizar logout (se necessário no backend)
 * @returns {Promise} Promise com a resposta
 */
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * Função para buscar filmes
 * @param {string} query - Termo de busca
 * @returns {Promise} Promise com os dados dos filmes encontrados
 */
export const searchMovies = async (query) => {
  const response = await api.get("/movies", {
    params: {
      query: query.trim(),
    },
  });

  const data = response.data;
  if (Array.isArray(data)) return data;
  return data.results || data.movies || data.data || [];
};

/**
 * Função para inserir um novo filme
 * @param {object} movieData - Dados do filme (title, year, genre, director, rating, description)
 * @returns {Promise} Promise com os dados do filme criado
 */
export const insertMovie = async (movieData) => {
  const response = await api.post("/movies", movieData);
  return response.data;
};

// Exporta a instância do axios para uso em outros serviços
export default api;
