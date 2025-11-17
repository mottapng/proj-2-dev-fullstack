/**
 * Sistema de cache em memória para otimização de respostas
 * Cache simples usando Map para armazenar resultados de buscas
 */
class Cache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos por padrão
  }

  /**
   * Gera uma chave de cache baseada nos parâmetros
   */
  generateKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Armazena um valor no cache com TTL
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Recupera um valor do cache se ainda válido
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Verifica se expirou
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Remove uma chave do cache
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Remove entradas expiradas (limpeza periódica)
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new Cache();

// Limpeza automática a cada 10 minutos
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

module.exports = cache;
