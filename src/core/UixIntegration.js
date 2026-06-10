/**
 * UIX integration for Todo Swipe Card
 *
 * UIX (https://uix.lf.technology) styles a card by injecting a `uix-node` element
 * and styles into the card's shadow root. Because Todo Swipe Card wipes and rebuilds
 * its shadow DOM (and recreates the todo cards) on every rebuild, any UIX styling that was
 * auto-applied gets stripped. This module re-applies UIX explicitly after each build so
 * the styling survives.
 *
 * When UIX is not installed, `customElements.whenDefined("uix-node")` never resolves,
 * so the callbacks below never run and this becomes a pure no-op.
 */

import { debugLog } from '../utils/Debug.js';

let _uixPromise = null;

/**
 * Resolves with the UIX API object once the `uix-node` element is defined.
 * The promise is cached so we register only one waiter. If UIX is never installed,
 * the promise never resolves, so callers' `.then()` never fires.
 * @returns {Promise<Object|null>}
 */
function getUix() {
  if (_uixPromise) return _uixPromise;
  _uixPromise = customElements.whenDefined('uix-node').catch(() => null);
  return _uixPromise;
}

/**
 * Apply UIX styling to an element. No-op when uixConfig is absent or UIX is not installed.
 * @param {HTMLElement} element - host element or todo card element to style
 * @param {Object|undefined} uixConfig - the `uix:` block from the element's config
 * @param {Object} elementConfig - full element config, passed as jinja vars `{ config }`
 * @param {string} [type="card"] - UIX "type" (determines which theme variables apply)
 */
export function applyUix(element, uixConfig, elementConfig, type = 'card') {
  if (!uixConfig || !element) return;
  getUix().then((uix) => {
    if (!uix || typeof uix.applyToElement !== 'function') return;
    try {
      uix.applyToElement(element, type, uixConfig, { config: elementConfig }, true, undefined);
      debugLog('UIX: Applied UIX to element', { type });
    } catch (e) {
      console.warn('TodoSwipeCard: UIX applyToElement failed:', e);
    }
  });
}
