import { debugLog } from '../utils/Debug.js';

/**
 * DEPENDENCY LOADING STRATEGY:
 *
 * This file handles loading LitElement and related dependencies with multiple fallback layers
 * to ensure the card works in various Home Assistant environments:
 *
 * 1. PRIMARY: Use Home Assistant's built-in LitElement (most common case)
 * 2. FALLBACK: Load from CDN (for older HA versions or custom setups)
 * 3. EMERGENCY: Use basic HTMLElement with polyfills (for extreme cases)
 *
 * This approach ensures maximum compatibility across HA versions and network conditions.
 */

// Initialize variables that will hold our dependencies
let LitElement, html, css, fireEvent;

/**
 * ATTEMPT 1: Use Home Assistant's built-in LitElement
 *
 * Modern HA versions include LitElement globally, which is the most reliable
 * and performant option since it's already loaded and matches HA's version.
 */
try {
  if (window.customElements && window.customElements.get('ha-card')) {
    // Extract LitElement from an existing HA component's prototype chain
    const litModule = customElements.get('ha-card').__proto__.constructor.__proto__.constructor;
    LitElement = litModule;

    // Get html and css template functions from global lit namespace
    html = window.lit?.html || window.LitElement?.html;
    css = window.lit?.css || window.LitElement?.css;

    debugLog('Using Home Assistant built-in LitElement');
  }
} catch (e) {
  debugLog('Could not use built-in LitElement, will try CDN fallback:', e.message);
}

/**
 * ATTEMPT 2: CDN Fallback for missing or incompatible built-in LitElement
 *
 * If built-in LitElement isn't available or doesn't work, dynamically import
 * from multiple CDN sources with fallback chain for reliability.
 */
if (!LitElement || !html || !css) {
  const loadDependencies = async () => {
    try {
      // Multiple CDN sources for redundancy (in order of preference)
      const cdnSources = [
        'https://cdn.jsdelivr.net/npm/lit-element@2.5.1/+esm', // Primary CDN
        'https://unpkg.com/lit-element@2.5.1/lit-element.js?module', // Alternative CDN
        'https://cdn.skypack.dev/lit-element@2.5.1' // Backup CDN
      ];

      let litLoaded = false;

      // Try each CDN source until one succeeds
      for (const source of cdnSources) {
        try {
          debugLog(`Attempting to load LitElement from: ${source}`);
          const module = await import(source);

          LitElement = module.LitElement;
          html = module.html;
          css = module.css;
          litLoaded = true;

          debugLog(`Successfully loaded LitElement from: ${source}`);
          break;
        } catch (e) {
          console.warn(`TodoSwipeCard: Failed to load from ${source}:`, e.message);
          // Continue to next CDN source
        }
      }

      if (!litLoaded) {
        throw new Error('Could not load LitElement from any CDN source');
      }
    } catch (error) {
      console.error('TodoSwipeCard: All LitElement loading attempts failed:', error);

      /**
       * ATTEMPT 3: Emergency Fallback - Basic HTMLElement with Polyfills
       *
       * If both built-in and CDN loading fail (offline mode, network issues, etc.),
       * fall back to basic HTMLElement with minimal template function polyfills.
       * This provides degraded functionality but keeps the card operational.
       */
      debugLog('Using emergency HTMLElement fallback with polyfills');

      LitElement = HTMLElement;

      // Basic template literal function that concatenates strings
      html = (strings, ...values) => {
        return strings.reduce((result, string, i) => {
          return result + string + (values[i] || '');
        }, '');
      };

      // CSS function that just returns the first template string
      css = (strings) => strings[0];
    }
  };

  // Use top-level await to ensure dependencies are loaded before module exports
  try {
    await loadDependencies();
  } catch (e) {
    // If even the emergency fallback fails, use the most basic implementation
    debugLog('Emergency fallback initialization failed, using minimal polyfills');

    LitElement = HTMLElement;
    html = (strings, ...values) => {
      return strings.reduce((result, string, i) => {
        return result + string + (values[i] || '');
      }, '');
    };
    css = (strings) => strings[0];
  }
}

/**
 * FIREEEVENT FUNCTION LOADING
 *
 * FireEvent is used for dispatching custom events to Home Assistant.
 * Try multiple sources with fallback to basic CustomEvent implementation.
 */
try {
  // First try: Use HA's global fireEvent if available
  if (window.customCards && window.fireEvent) {
    fireEvent = window.fireEvent;
    debugLog('Using Home Assistant global fireEvent');
  } else {
    // Second try: Import from custom-card-helpers
    const helpersModule = await import('https://unpkg.com/custom-card-helpers@^1?module');
    fireEvent = helpersModule.fireEvent;
    debugLog('Loaded fireEvent from custom-card-helpers');
  }
} catch (error) {
  debugLog('Using fallback fireEvent implementation');

  /**
   * Fallback fireEvent Implementation
   *
   * Creates and dispatches CustomEvents with proper bubbling and composition
   * for communication with Home Assistant's event system.
   */
  fireEvent = (node, type, detail = {}) => {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true, // Allow event to bubble up DOM tree
      composed: true // Allow event to cross shadow DOM boundaries
    });
    node.dispatchEvent(event);
  };
}

// Export the loaded dependencies for use by other modules
export { LitElement, html, css, fireEvent };
