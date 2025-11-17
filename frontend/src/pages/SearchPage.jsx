import { useState, useEffect } from "react";
import { searchMovies } from "../services/api";
import Toast from "../components/Toast";
import { sanitizeInput } from "../utils/sanitize";

const SearchPage = () => {
  // Estados
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /**
   * Debounce: atualiza debouncedQuery após 1000ms sem digitação
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * Limpa a tabela quando a query é limpa
   */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setError("");
      return;
    }
  }, [debouncedQuery]);

  /**
   * Busca filmes quando debouncedQuery muda
   */
  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedQuery.trim()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await searchMovies(debouncedQuery);
        const moviesList = Array.isArray(data)
          ? data
          : data.movies || data.data || [];
        setMovies(moviesList);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Erro ao buscar filmes. Tente novamente.";
        setError(message);
        setShowToast(true);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedQuery]);

  /**
   * Função para lidar com o submit do formulário
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Por favor, digite um termo de busca");
      setShowToast(true);
      return;
    }

    setDebouncedQuery(query.trim());
  };

  /**
   * Função para limpar a busca
   */
  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setMovies([]);
    setError("");
    setShowToast(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Card de busca */}
        <div
          className="card border-0 shadow-lg"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Header */}
          <div
            className="card-header border-0 text-center py-3"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <div className="mb-2" style={{ fontSize: "2rem" }}>
              🎬
            </div>
            <h1
              className="mb-1 fw-bold"
              style={{
                fontSize: "1.75rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Buscar Filmes
            </h1>
            <p className="mb-0 opacity-75" style={{ fontSize: "0.95rem" }}>
              Encontre seus filmes favoritos
            </p>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1", minWidth: "250px" }}>
                  <div className="input-group">
                    <span
                      className="input-group-text border-end-0"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        borderRadius: "12px 0 0 12px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#6c757d"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Digite o nome do filme, diretor, gênero..."
                      value={query}
                      onChange={(e) => {
                        setQuery(sanitizeInput(e.target.value, 200));
                        setError("");
                      }}
                      disabled={loading}
                      style={{
                        borderRadius: "0 12px 12px 0",
                        padding: "0.75rem 1rem",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-lg fw-semibold text-white border-0"
                    disabled={loading || !query.trim()}
                    style={{
                      background:
                        loading || !query.trim()
                          ? "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "12px",
                      padding: "0.25rem 1.5rem",
                      boxShadow:
                        loading || !query.trim()
                          ? "none"
                          : "0 4px 15px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-search me-2 mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                        Buscar
                      </>
                    )}
                  </button>
                  {query && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={handleClear}
                      disabled={loading}
                      style={{
                        borderRadius: "12px",
                        padding: "0.25rem 1.5rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Spinner de loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 0",
            }}
          >
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Buscando...</span>
            </div>
            <p className="mt-3 text-muted">Buscando filmes...</p>
          </div>
        )}

        {/* Tabela de resultados */}
        {!loading && movies.length > 0 && (
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              className="card-header border-0 text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-film me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
                </svg>
                Resultados da Busca ({movies.length}{" "}
                {movies.length === 1
                  ? "filme encontrado"
                  : "filmes encontrados"}
                )
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead
                    style={{
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <tr>
                      <th scope="col" style={{ width: "20%", padding: "1rem" }}>
                        Título
                      </th>
                      <th scope="col" style={{ width: "8%", padding: "1rem" }}>
                        Ano
                      </th>
                      <th scope="col" style={{ width: "12%", padding: "1rem" }}>
                        Gênero
                      </th>
                      <th scope="col" style={{ width: "15%", padding: "1rem" }}>
                        Diretor
                      </th>
                      <th scope="col" style={{ width: "8%", padding: "1rem" }}>
                        Nota
                      </th>
                      <th scope="col" style={{ width: "37%", padding: "1rem" }}>
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, index) => (
                      <tr
                        key={movie.id || movie._id || index}
                        style={{
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <td
                          className="fw-semibold"
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          {movie.title || movie.titulo || "N/A"}
                        </td>
                        <td
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          {movie.year || movie.ano || "N/A"}
                        </td>
                        <td
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#667eea",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "8px",
                            }}
                          >
                            {movie.genre || movie.genero || "N/A"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          {movie.director || movie.diretor || "N/A"}
                        </td>
                        <td
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          {movie.rating || movie.nota || movie.score ? (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "#28a745",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "8px",
                              }}
                            >
                              {movie.rating || movie.nota || movie.score}/10
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td
                          className="text-muted small"
                          style={{ padding: "1rem", verticalAlign: "middle" }}
                        >
                          {movie.description ||
                            movie.descricao ||
                            movie.plot ||
                            "Sem descrição disponível"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {!loading && debouncedQuery && movies.length === 0 && !error && (
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "20px",
              width: "100%",
            }}
          >
            <div className="card-body text-center py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="#6c757d"
                className="bi bi-search mb-3 opacity-50"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
              <p className="text-muted fs-5 mb-0">
                Nenhum filme encontrado para "{debouncedQuery}"
              </p>
            </div>
          </div>
        )}

        {/* Mensagem inicial */}
        {!debouncedQuery && !loading && movies.length === 0 && (
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "20px",
              width: "100%",
            }}
          >
            <div className="card-body text-center py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="#6c757d"
                className="bi bi-search mb-3 opacity-50"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
              <p className="text-muted fs-5 mb-0">
                Digite um termo de busca para encontrar filmes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Toast de erro */}
      <Toast
        message={error}
        type="error"
        show={showToast}
        onClose={() => {
          setShowToast(false);
          setError("");
        }}
      />
    </div>
  );
};

export default SearchPage;
