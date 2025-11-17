/**
 * Sistema de blacklist de tokens para invalidação de tokens JWT
 * Armazena tokens invalidados (logout) até que expirem
 */
class TokenBlacklist {
  constructor() {
    this.blacklist = new Map();
  }

  /**
   * Adiciona um token à blacklist
   * @param {string} token - Token JWT a ser invalidado
   * @param {number} expiresAt - Timestamp de expiração do token (em ms)
   */
  add(token, expiresAt) {
    this.blacklist.set(token, expiresAt);
    
    // Remove automaticamente após expirar
    const ttl = expiresAt - Date.now();
    if (ttl > 0) {
      setTimeout(() => {
        this.blacklist.delete(token);
      }, ttl);
    }
  }

  /**
   * Verifica se um token está na blacklist
   * @param {string} token - Token JWT a ser verificado
   * @returns {boolean} true se o token está na blacklist
   */
  has(token) {
    const expiresAt = this.blacklist.get(token);
    if (!expiresAt) return false;
    
    // Se já expirou, remove da blacklist
    if (Date.now() > expiresAt) {
      this.blacklist.delete(token);
      return false;
    }
    
    return true;
  }

  /**
   * Remove um token da blacklist (útil para testes)
   */
  remove(token) {
    return this.blacklist.delete(token);
  }

  /**
   * Limpa a blacklist
   */
  clear() {
    this.blacklist.clear();
  }

  /**
   * Limpa tokens expirados da blacklist
   */
  cleanup() {
    const now = Date.now();
    for (const [token, expiresAt] of this.blacklist.entries()) {
      if (now > expiresAt) {
        this.blacklist.delete(token);
      }
    }
  }
}

// Instância singleton
const tokenBlacklist = new TokenBlacklist();

// Limpeza automática a cada 1 hora
setInterval(() => {
  tokenBlacklist.cleanup();
}, 60 * 60 * 1000);

module.exports = tokenBlacklist;

