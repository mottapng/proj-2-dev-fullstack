import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import InsertPage from "./pages/InsertPage";
import "./App.css";

/**
 * Componente principal da aplicação
 * Configura as rotas e o contexto de autenticação
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Rota raiz redireciona para login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rota pública de login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas protegidas - requerem autenticação */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insert"
              element={
                <ProtectedRoute>
                  <InsertPage />
                </ProtectedRoute>
              }
            />

            {/* Rota catch-all para páginas não encontradas */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
