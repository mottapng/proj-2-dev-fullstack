import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login as apiLogin } from "../services/api";
import Toast from "../components/Toast";
import "./LoginPage.css";

/**
 * Página de Login
 * UI moderna com tema de filmes
 * Inclui validação de campos, tratamento de erros e feedback visual
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de validação e erro
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Valida os campos do formulário
   * @returns {boolean} true se válido, false caso contrário
   */
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = " ";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password.trim()) {
      newErrors.password = " ";
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
    setErrorMessage("");

    // Validação dos campos
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Chama a API de login
      const response = await apiLogin(email, password);

      // Em caso de sucesso, salva o token e dados do usuário
      const token = response.token;
      const user = response.user || { email };

      if (token) {
        // Chama a função login do AuthContext
        login(token, user);
        // Redireciona para a página de busca
        navigate("/search");
      } else {
        setErrorMessage("Resposta inválida do servidor");
        setShowToast(true);
      }
    } catch (error) {
      // Trata erros da requisição
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro ao realizar login. Tente novamente.";
      setErrorMessage(message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: "2rem 1rem",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Overlay escuro para melhor contraste */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      {/* Efeito de partículas/cinema */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "500px", padding: "0 1rem" }}>
          {/* Card principal com design moderno */}
          <div
            className="card border-0 shadow-lg"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              overflow: "hidden",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            {/* Header do card com tema de cinema */}
            <div
              className="card-header border-0 text-center py-3"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                position: "relative",
              }}
            >
              {/* Ícone de filme */}
              <div className="mb-2" style={{ fontSize: "2.5rem" }}>
                🎬
              </div>
              <h1
                className="mb-1 fw-bold"
                style={{
                  fontSize: "2rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  letterSpacing: "1px",
                }}
              >
                Filmes App
              </h1>
              <p className="mb-0 opacity-75" style={{ fontSize: "0.95rem" }}>
                Entre para explorar o mundo do cinema
              </p>
            </div>

            {/* Body do card */}
            <div className="card-body p-4">
              {/* Formulário */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Campo Email */}
                <div className="mb-3">
                  <div className="input-group">
                    <span
                      className="input-group-text border-end-0"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: errors.email ? "#dc3545" : "#dee2e6",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#6c757d"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className={`form-control border-start-0 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                        setErrorMessage("");
                      }}
                      placeholder="seu@email.com"
                      disabled={loading}
                      required
                      style={{
                        borderRadius: "0 8px 8px 0",
                        borderColor: errors.email ? "#dc3545" : "#dee2e6",
                        padding: "0.75rem 1rem",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block mt-2">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Campo Password */}
                <div className="mb-3">
                  <div className="input-group">
                    <span
                      className="input-group-text border-end-0"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderColor: errors.password ? "#dc3545" : "#dee2e6",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="#6c757d"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      className={`form-control border-start-0 ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                        setErrorMessage("");
                      }}
                      placeholder="Digite sua senha"
                      disabled={loading}
                      required
                      style={{
                        borderRadius: "0 8px 8px 0",
                        borderColor: errors.password ? "#dc3545" : "#dee2e6",
                        padding: "0.75rem 1rem",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block mt-2">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Botão de Submit */}
                <div className="d-grid mt-3">
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
                      fontSize: "1.1rem",
                      boxShadow: loading
                        ? "none"
                        : "0 4px 15px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.3s ease",
                      transform: loading ? "none" : "translateY(0)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(102, 126, 234, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 15px rgba(102, 126, 234, 0.4)";
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                          style={{ width: "1.2rem", height: "1.2rem" }}
                        ></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-box-arrow-in-right me-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                          />
                        </svg>
                        Entrar
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer com informações adicionais */}
              <div
                className="text-center mt-3 pt-2"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-info-circle me-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                  Explore milhares de filmes e descubra novos favoritos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast de erro */}
      <Toast
        message={errorMessage}
        type="error"
        show={showToast}
        onClose={() => {
          setShowToast(false);
          setErrorMessage("");
        }}
      />
    </div>
  );
};

export default LoginPage;
