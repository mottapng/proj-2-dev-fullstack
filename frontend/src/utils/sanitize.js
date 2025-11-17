/**
 * Utilitários para prevenção de XSS (Cross-Site Scripting)
 * Sanitiza inputs do usuário antes de exibir ou enviar ao servidor
 */

/**
 * Escapa caracteres HTML especiais para prevenir XSS
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export const escapeHtml = (str) => {
  if (typeof str !== "string") return str;

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return str.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Remove tags HTML e scripts de uma string
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sem tags HTML
 */
export const stripHtml = (str) => {
  if (typeof str !== "string") return str;

  // Remove tags HTML
  let text = str.replace(/<[^>]*>/g, "");

  // Remove entidades HTML
  text = text.replace(/&[^;]+;/g, "");

  return text.trim();
};

/**
 * Sanitiza um objeto removendo tags HTML de strings
 * @param {object} obj - Objeto a ser sanitizado
 * @returns {object} Objeto sanitizado
 */
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return stripHtml(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === "object") {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Valida e sanitiza um input de formulário
 * Remove caracteres perigosos e limita tamanho
 * @param {string} value - Valor a ser sanitizado
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} Valor sanitizado
 */
export const sanitizeInput = (value, maxLength = 1000) => {
  if (typeof value !== "string") return value;

  // Remove tags HTML
  let sanitized = stripHtml(value);

  // Limita tamanho
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove caracteres de controle
  sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, ""); // eslint-disable-line no-control-regex

  return sanitized.trim();
};
