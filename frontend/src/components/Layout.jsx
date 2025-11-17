import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Componente de layout principal da aplicação
 * Contém a Navbar com links de navegação que mudam conforme o estado de autenticação
 */
const Layout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Função para lidar com o logout
   * Remove a autenticação e redireciona para a página de login
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Verifica se está na página de login para não mostrar navbar
  const isLoginPage = location.pathname === "/login";

  return (
    <div style={{ margin: 0, padding: 0, width: "100%", minHeight: "100vh" }}>
      {!isLoginPage && (
        <header
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "1rem 0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🎬</span>
              <span>Filmes App</span>
            </Link>
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/search"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      transition: "background-color 0.2s",
                      backgroundColor:
                        location.pathname === "/search"
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/search") {
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/search") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    Buscar Filmes
                  </Link>
                  <Link
                    to="/insert"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      transition: "background-color 0.2s",
                      backgroundColor:
                        location.pathname === "/insert"
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/insert") {
                        e.target.style.backgroundColor =
                          "rgba(255,255,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/insert") {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    Inserir Filme
                  </Link>
                  {user && (
                    <span
                      style={{
                        color: "white",
                        padding: "0.5rem 1rem",
                        opacity: 0.9,
                        fontSize: "0.9rem",
                      }}
                    >
                      Olá, {user.name || user.email || "Usuário"}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.2)";
                    }}
                  >
                    Sair
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      {/* Conteúdo principal */}
      <main
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: isLoginPage ? "100vh" : "calc(100vh - 73px)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
