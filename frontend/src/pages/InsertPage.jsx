import { useState } from "react";
import { insertMovie } from "../services/api";
import Toast from "../components/Toast";

/**
 * Página de Inserção de Filmes
 * UI moderna para adicionar novos filmes ao sistema
 */
const InsertPage = () => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    genre: "",
    director: "",
    rating: "",
    description: "",
  });

  // Estados de validação e feedback
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Função para atualizar os campos do formulário
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Limpa mensagens ao editar
    setSuccessMessage("");
    setErrorMessage("");
  };

  /**
   * Valida os campos do formulário
   * @returns {boolean} true se válido, false caso contrário
   */
  const validateForm = () => {
    const newErrors = {};

    // Validação do título
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Título deve ter pelo menos 2 caracteres";
    }

    // Validação do ano
    if (!formData.year) {
      newErrors.year = "Ano é obrigatório";
    } else {
      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) {
        newErrors.year = `Ano deve ser entre 1888 e ${new Date().getFullYear() + 1}`;
      }
    }

    // Validação do gênero
    if (!formData.genre.trim()) {
      newErrors.genre = "Gênero é obrigatório";
    } else if (formData.genre.trim().length < 2) {
      newErrors.genre = "Gênero deve ter pelo menos 2 caracteres";
    }

    // Validação do diretor
    if (!formData.director.trim()) {
      newErrors.director = "Diretor é obrigatório";
    } else if (formData.director.trim().length < 2) {
      newErrors.director = "Diretor deve ter pelo menos 2 caracteres";
    }

    // Validação da nota
    if (!formData.rating) {
      newErrors.rating = "Nota é obrigatória";
    } else {
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 10) {
        newErrors.rating = "Nota deve ser um número entre 0 e 10";
      }
    }

    // Validação da descrição
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Descrição deve ter pelo menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Função para lidar com o submit do formulário
   * @param {Event} e - Evento do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validação dos campos
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepara os dados para envio
      const movieData = {
        title: formData.title.trim(),
        year: parseInt(formData.year),
        genre: formData.genre.trim(),
        director: formData.director.trim(),
        rating: parseFloat(formData.rating),
        description: formData.description.trim(),
      };

      // Chama a API
      await insertMovie(movieData);

      // Sucesso
      setSuccessMessage("Filme inserido com sucesso!");
      setShowSuccessToast(true);
      
      // Limpa o formulário
      setFormData({
        title: "",
        year: "",
        genre: "",
        director: "",
        rating: "",
        description: "",
      });
      setErrors({});
    } catch (err) {
      // Trata erros
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erro ao inserir filme. Tente novamente.";
      setErrorMessage(message);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
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
        {/* Card principal */}
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
              Inserir Filme
            </h1>
            <p className="mb-0 opacity-75" style={{ fontSize: "0.95rem" }}>
              Adicione um novo filme ao catálogo
            </p>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            {/* Formulário */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Campo Título */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Título <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: O Poderoso Chefão"
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                />
                {errors.title && (
                  <div className="invalid-feedback d-block">{errors.title}</div>
                )}
              </div>

              {/* Campo Ano */}
              <div className="mb-3">
                <label htmlFor="year" className="form-label fw-semibold">
                  Ano <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.year ? "is-invalid" : ""}`}
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ex: 1972"
                  min="1888"
                  max={new Date().getFullYear() + 1}
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                />
                {errors.year && (
                  <div className="invalid-feedback d-block">{errors.year}</div>
                )}
              </div>

              {/* Campo Gênero */}
              <div className="mb-3">
                <label htmlFor="genre" className="form-label fw-semibold">
                  Gênero <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.genre ? "is-invalid" : ""}`}
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Ex: Drama, Ação, Comédia..."
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                />
                {errors.genre && (
                  <div className="invalid-feedback d-block">{errors.genre}</div>
                )}
              </div>

              {/* Campo Diretor */}
              <div className="mb-3">
                <label htmlFor="director" className="form-label fw-semibold">
                  Diretor <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.director ? "is-invalid" : ""}`}
                  id="director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Ex: Francis Ford Coppola"
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                />
                {errors.director && (
                  <div className="invalid-feedback d-block">{errors.director}</div>
                )}
              </div>

              {/* Campo Nota */}
              <div className="mb-3">
                <label htmlFor="rating" className="form-label fw-semibold">
                  Nota (0-10) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className={`form-control ${errors.rating ? "is-invalid" : ""}`}
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Ex: 9.2"
                  min="0"
                  max="10"
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                  }}
                />
                {errors.rating && (
                  <div className="invalid-feedback d-block">{errors.rating}</div>
                )}
              </div>

              {/* Campo Descrição */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold">
                  Descrição <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o filme..."
                  rows="4"
                  disabled={loading}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    resize: "vertical",
                  }}
                />
                {errors.description && (
                  <div className="invalid-feedback d-block">
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Botão de Submit */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-lg fw-semibold text-white border-0"
                  disabled={loading}
                  style={{
                    background: loading
                      ? "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    padding: "0.875rem 2rem",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 15px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Inserindo...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-plus-circle me-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      Inserir Filme
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast de sucesso */}
      <Toast
        message={successMessage}
        type="success"
        show={showSuccessToast}
        onClose={() => {
          setShowSuccessToast(false);
          setSuccessMessage("");
        }}
      />

      {/* Toast de erro */}
      <Toast
        message={errorMessage}
        type="error"
        show={showErrorToast}
        onClose={() => {
          setShowErrorToast(false);
          setErrorMessage("");
        }}
      />
    </div>
  );
};

export default InsertPage;
