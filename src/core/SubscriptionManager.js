import { debugLog } from '../utils/Debug.js';
import { subscribeToTodoItems } from '../features/TodoOperations.js';

/**
 * SubscriptionManager handles all todo subscription management for TodoSwipeCard
 * Manages subscriptions, updates, and cache lifecycle
 */
export class SubscriptionManager {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;

    // Bind the handleTodoUpdate method for event listeners
    this.handleTodoUpdate = this.handleTodoUpdate.bind(this);
  }

  /**
   * Get hass object from card instance
   * @returns {Object} Home Assistant object
   * @private
   */
  get _hass() {
    return this.cardInstance._hass;
  }

  /**
   * Get config object from card instance
   * @returns {Object} Card configuration
   * @private
   */
  get _config() {
    return this.cardInstance._config;
  }

  /**
   * Initialize subscriptions when hass becomes available and cards are ready
   * @param {Object} hass - Home Assistant object
   * @param {Object} previousHass - Previous hass object
   */
  async initializeSubscriptions(hass, previousHass) {
    // If not initialized yet, just store hass and return
    if (
      !this.cardInstance.initialized ||
      !this.cardInstance.cards ||
      this.cardInstance.cards.length === 0
    ) {
      debugLog('Not initialized yet or no cards, storing hass and returning');
      return;
    }

    // If this is the first time we get hass after cards are created, set up subscriptions
    if (!previousHass && this.cardInstance.cards.length > 0) {
      debugLog('First hass after cards created, setting up subscriptions');

      for (const card of this.cardInstance.cards) {
        if (card && card.entityId) {
          debugLog(`Setting up subscription for ${card.entityId}`);

          // Clean up any existing subscription
          const existingUnsub = this.cardInstance._todoSubscriptions?.get(card.entityId);
          if (existingUnsub && typeof existingUnsub === 'function') {
            try {
              existingUnsub();
            } catch (e) {
              debugLog('Error cleaning up subscription:', e);
            }
          }

          // Create new subscription
          const unsubscribe = await subscribeToTodoItems(card.entityId, this._hass);
          if (!this.cardInstance._todoSubscriptions) {
            this.cardInstance._todoSubscriptions = new Map();
          }
          this.cardInstance._todoSubscriptions.set(card.entityId, unsubscribe);

          // Do initial update
          setTimeout(async () => {
            await this.cardInstance.cardBuilder.updateNativeTodoCard(card.element, card.entityId);
          }, 100);
        }
      }
    }
  }

  /**
   * Setup todo update event listener
   */
  setupEventListeners() {
    // Add todo update listener
    document.addEventListener('todo-items-updated', this.handleTodoUpdate);
  }

  /**
   * Remove todo update event listener
   */
  removeEventListeners() {
    // Remove todo update listener
    document.removeEventListener('todo-items-updated', this.handleTodoUpdate);
  }

  /**
   * Handle todo items update event
   * @param {CustomEvent} event - Todo update event
   */
  handleTodoUpdate(event) {
    const { entityId, items } = event.detail;

    // Cache the items
    if (!this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache = new Map();
    }
    this.cardInstance._todoItemsCache.set(entityId, items);

    // Find and update the card immediately
    const card = this.cardInstance.cards.find((c) => c.entityId === entityId);
    if (card && card.element) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        this.cardInstance.cardBuilder.updateNativeTodoCard(card.element, entityId);
      }, 50);
    }
  }

  /**
   * Clean up all subscriptions and caches
   */
  cleanup() {
    debugLog('SubscriptionManager performing cleanup');

    // Clean up todo subscriptions
    if (this.cardInstance._todoSubscriptions) {
      this.cardInstance._todoSubscriptions.forEach((unsubscribe, entityId) => {
        try {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        } catch (e) {
          console.warn(`Error unsubscribing from todo entity ${entityId}:`, e);
        }
      });
      this.cardInstance._todoSubscriptions.clear();
    }

    // Clear items cache
    if (this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache.clear();
    }

    // Remove event listeners
    this.removeEventListeners();

    debugLog('SubscriptionManager cleanup completed');
  }
}
