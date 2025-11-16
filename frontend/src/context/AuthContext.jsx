import { createContext, useState } from 'react';

/**
 * Contexto de autenticação para gerenciar o estado de login do usuário
 * Armazena token e informações do usuário no localStorage
 */
export const AuthContext = createContext(null);

/**
 * Provider do AuthContext
 * Gerencia o estado de autenticação e fornece funções de login/logout
 */
export const AuthProvider = ({ children }) => {
  // Função para inicializar o estado a partir do localStorage
  const getInitialState = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return {
      token: storedToken || null,
      user: storedUser ? JSON.parse(storedUser) : null,
      loading: false
    };
  };

  // Estado para armazenar o token de autenticação
  const [token, setToken] = useState(() => {
    const initialState = getInitialState();
    return initialState.token;
  });
  // Estado para armazenar informações do usuário
  const [user, setUser] = useState(() => {
    const initialState = getInitialState();
    return initialState.user;
  });
  // Estado para controlar se a verificação inicial foi concluída
  // Inicializa como false já que o estado é carregado sincronamente
  const [loading] = useState(false);

  /**
   * Função de login
   * Salva o token e informações do usuário no localStorage e no estado
   * @param {string} authToken - Token de autenticação
   * @param {object} userData - Dados do usuário
   */
  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Função de logout
   * Remove o token e informações do usuário do localStorage e do estado
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Valor do contexto
  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

