// utils.js

/**
 * Detects if the given text is Persian or English.
 * Returns 'fa' for Persian, 'en' for English.
 * @param {string} text
 * @returns {string}
 */
export function detectLanguage(text) {
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text) ? 'fa' : 'en';
}
