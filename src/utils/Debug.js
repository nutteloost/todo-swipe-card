import { DEBUG } from './Constants.js';

/**
 * Log debug messages when debug mode is enabled
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
export const debugLog = (message, data) => {
  if (!DEBUG) return;
  console.log(`[TodoSwipeCard] ${message}`, data !== undefined ? data : '');
};
