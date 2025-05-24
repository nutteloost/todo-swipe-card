/**
 * Todo Swipe Card - Fixed WebSocket Overflow Version
 * 
 * A specialized swipe card for todo lists in Home Assistant
 * Allows users to swipe between multiple todo lists with customized styling
 * 
 * Requires card-mod to be installed: https://github.com/thomasloven/lovelace-card-mod
 * 
 * @author nutteloost
 * @version 1.6.0
 * @license MIT
 * @see {@link https://github.com/nutteloost/todo-swipe-card}
 */

import { LitElement, html, css } from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

// Configurable debug mode - set to false for production
const DEBUG = false;

/**
 * Log debug messages when debug mode is enabled
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
const debugLog = (message, data) => {
  if (!DEBUG) return;
  console.log(`[TodoSwipeCard] ${message}`, data !== undefined ? data : '');
};

/**
 * TodoSwipeCard: A custom card for Home Assistant to display multiple todo lists with swipe navigation
 * @extends HTMLElement
 */
class TodoSwipeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._hassLastUpdated = null; // Track last update time
    this.cards = [];
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    this.initialized = false;
    this.building = false;
    this._styleCache = new Map(); // Use Map for better performance
    this._menuObservers = [];
    this._dynamicStyleElement = null;
    this._configUpdateTimer = null; // Timer for debouncing config updates
    this._buildPromise = null; // Track ongoing build operations
    this._cardHelpers = null; // Cache card helpers
    this._lastConfig = null; // Track last config to detect real changes
    this._updateThrottle = null; // Throttle hass updates
  }

  /**
   * Returns default configuration for the card
   * @returns {Object} Default configuration
   */
  static getStubConfig() {
    return {
      show_pagination: true,
      show_addbutton: false,
      show_create: true,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false,
      card_spacing: 15,
      custom_card_mod: {}
    };
  }
  
  /**
   * Returns the editor element for the card
   * @returns {HTMLElement} Card editor element
   */
  static getConfigElement() {
    return document.createElement("todo-swipe-card-editor");
  }

  /**
   * Handle edit button click in preview mode
   * @param {Event} e - Click event
   * @private
   */
  _handleEditClick(e) {
    e.stopPropagation();
    debugLog("Edit button clicked, firing show-edit-card event");
    const event = new CustomEvent('show-edit-card', {
      detail: { element: this },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Check if there are valid entities configured
   * @returns {boolean} True if valid entities are present
   * @private
   */
  _hasValidEntities() {
    return this._config && 
           this._config.entities && 
           Array.isArray(this._config.entities) && 
           this._config.entities.length > 0 &&
           this._config.entities.some(entity => entity && entity.trim() !== "");
  }

  /**
   * Check if configuration actually changed
   * @param {Object} newConfig - New configuration
   * @returns {boolean} True if config changed
   * @private
   */
  _hasConfigChanged(newConfig) {
    if (!this._lastConfig) return true;
    
    // Quick string comparison first
    const newConfigStr = JSON.stringify(newConfig);
    const lastConfigStr = JSON.stringify(this._lastConfig);
    
    return newConfigStr !== lastConfigStr;
  }

  /**
   * Check if hass update is significant enough to propagate to child cards
   * @param {Object} hass - New hass object
   * @returns {boolean} True if update should be propagated
   * @private
   */
  _shouldUpdateChildCards(hass) {
    if (!this._hass || !hass) return true;
    
    // Check if any of our monitored entities have changed
    const entities = this._config.entities || [];
    for (const entityId of entities) {
      if (!entityId || entityId.trim() === "") continue;
      
      const oldState = this._hass.states[entityId];
      const newState = hass.states[entityId];
      
      // Check if the entity state or attributes have changed
      if (!oldState || !newState) return true;
      if (oldState.state !== newState.state) return true;
      if (JSON.stringify(oldState.attributes) !== JSON.stringify(newState.attributes)) return true;
    }
    
    return false;
  }

  /**
   * Merge internal card-mod styling with user-provided custom styling
   * Uses caching for better performance
   * @param {Object} internalStyle - Internal card-mod style object
   * @param {Object} customStyle - User-provided card-mod style object
   * @returns {Object} Merged style object with custom styles taking precedence
   * @private
   */
  _mergeCardModStyles(internalStyle, customStyle) {
    // Ensure style cache exists
    if (!this._styleCache) {
      this._styleCache = new Map();
    }
    
    // Create cache key
    const cacheKey = JSON.stringify({ internal: internalStyle, custom: customStyle });
    
    // Check cache first
    if (this._styleCache.has(cacheKey)) {
      return this._styleCache.get(cacheKey);
    }
    
    // If no custom style provided, return internal style
    if (!customStyle || Object.keys(customStyle).length === 0) {
      this._styleCache.set(cacheKey, internalStyle);
      return internalStyle;
    }
    
    // Start with a copy of the internal style
    const mergedStyle = JSON.parse(JSON.stringify(internalStyle));
    
    // Loop through all selectors in custom style
    for (const selector in customStyle) {
      if (selector in mergedStyle) {
        // If the selector already exists in internal style
        if (typeof customStyle[selector] === 'object' && 
            typeof mergedStyle[selector] === 'object') {
          // Handle nested objects (like the $ selector in ha-textfield)
          if (selector === 'ha-textfield' && 
              customStyle[selector].$ && 
              mergedStyle[selector].$) {
            // For special nested $ case, we need to merge CSS text
            mergedStyle[selector].$ = mergedStyle[selector].$ + '\n' + customStyle[selector].$;
          } else {
            // For other objects, just override
            mergedStyle[selector] = {...mergedStyle[selector], ...customStyle[selector]};
          }
        } else if (typeof customStyle[selector] === 'string' && 
                  typeof mergedStyle[selector] === 'string') {
          // For string CSS values, concatenate with user style at the end (to override)
          mergedStyle[selector] = mergedStyle[selector] + '\n' + customStyle[selector];
        } else {
          // For any other case, override with user style
          mergedStyle[selector] = customStyle[selector];
        }
      } else {
        // If selector doesn't exist in internal style, add it
        mergedStyle[selector] = customStyle[selector];
      }
    }
    
    // Cache the result
    this._styleCache.set(cacheKey, mergedStyle);
    
    return mergedStyle;
  }

  /**
   * Apply card-mod styles to the card
   * Optimized to avoid redundant operations
   * @private
   */
  _applyCardModStyles() {
    // Ensure we have a valid shadowRoot
    if (!this.shadowRoot) return;
    
    // Create a style element for dynamic styles if it doesn't exist
    if (!this._dynamicStyleElement) {
      this._dynamicStyleElement = document.createElement('style');
      this.shadowRoot.appendChild(this._dynamicStyleElement);
    }
    
    // Generate CSS based on current config
    if (this._config && this._config.card_mod && typeof this._config.card_mod.style === 'string') {
      let cssText = this._config.card_mod.style;
      
      // Check if the style already contains :host selector
      if (cssText.includes(':host')) {
        // Use the style as-is if it already has :host
        this._dynamicStyleElement.textContent = cssText;
      } else {
        // Wrap in :host if it doesn't have it
        this._dynamicStyleElement.textContent = `
          :host {
            ${cssText}
          }
        `;
      }
    } else if (this._dynamicStyleElement) {
      this._dynamicStyleElement.textContent = '';
    }
  }

  /**
   * Extract and apply transition properties from card_mod styles
   * @private
   */
  _applyTransitionProperties() {
    if (!this.sliderElement || !this._config || !this._config.card_mod) return;
    
    try {
      // Default values
      let transitionSpeed = '0.3s';
      let transitionEasing = 'ease-out';
      
      // Extract transition properties from card_mod style
      if (typeof this._config.card_mod.style === 'string') {
        const styleString = this._config.card_mod.style;
        
        // Extract transition speed
        const speedRegex = /--todo-swipe-card-transition-speed\s*:\s*([^;]+)/i;
        const speedMatch = styleString.match(speedRegex);
        if (speedMatch && speedMatch[1]) {
          transitionSpeed = speedMatch[1].trim();
        }
        
        // Extract transition easing
        const easingRegex = /--todo-swipe-card-transition-easing\s*:\s*([^;]+)/i;
        const easingMatch = styleString.match(easingRegex);
        if (easingMatch && easingMatch[1]) {
          transitionEasing = easingMatch[1].trim();
        }
        
        // Extract delete button color
        const deleteButtonRegex = /--todo-swipe-card-delete-button-color\s*:\s*([^;]+)/i;
        const deleteButtonMatch = styleString.match(deleteButtonRegex);
        if (deleteButtonMatch && deleteButtonMatch[1]) {
          this._deleteButtonColor = deleteButtonMatch[1].trim();
          this._applyDeleteButtonColor();
        }
      }
      
      // Apply directly to the slider element with null check
      if (this.sliderElement && this.sliderElement.style) {
        const transitionValue = `transform ${transitionSpeed} ${transitionEasing}`;
        this.sliderElement.style.transition = transitionValue;
        
        // Store the values for later use
        this._transitionSpeed = transitionSpeed;
        this._transitionEasing = transitionEasing;
      }
    } catch (e) {
      console.error("Error applying transition properties:", e);
    }
  }

  /**
   * Apply delete button color to all existing delete buttons
   * @private
   */
  _applyDeleteButtonColor() {
    if (!this._deleteButtonColor) return;
    
    // Find all delete buttons and apply the color
    const deleteButtons = this.shadowRoot.querySelectorAll('.delete-completed-button');
    deleteButtons.forEach(button => {
      button.style.color = this._deleteButtonColor;
      
      // Also apply to the SVG inside
      const svg = button.querySelector('svg');
      if (svg) {
        svg.style.fill = this._deleteButtonColor;
      }
    });
  }

  /**
   * Set card configuration with improved debouncing
   * @param {Object} config - Card configuration
   */
  setConfig(config) {
    debugLog("setConfig called with:", JSON.stringify(config));
    
    // Ensure entities is an array with at least one item
    let entities = config.entities || [];
    if (!Array.isArray(entities)) {
      // Convert from old object format if needed
      if (typeof entities === 'object') {
        entities = Object.values(entities);
      } else if (typeof entities === 'string') {
        entities = [entities];
      } else {
        entities = [];
      }
    }
    
    // Clean up entities (remove empty values)
    entities = entities.filter(e => e && e.trim() !== "");

    // Set defaults and merge config
    const newConfig = {
      ...TodoSwipeCard.getStubConfig(),
      ...config,
      entities // Override with our sanitized entities array
    };

    // Ensure card_spacing is a valid number
    if (newConfig.card_spacing === undefined) {
      newConfig.card_spacing = 15; // Default spacing
    } else {
      newConfig.card_spacing = parseInt(newConfig.card_spacing);
      if (isNaN(newConfig.card_spacing) || newConfig.card_spacing < 0) {
        newConfig.card_spacing = 15;
      }
    }

    // Ensure background_images is an object
    if (!newConfig.background_images || typeof newConfig.background_images !== 'object') {
      newConfig.background_images = {};
    }

    // Prioritize card_mod if available, then fall back to custom_card_mod
    if (config.card_mod && typeof config.card_mod === 'object') {
      newConfig.custom_card_mod = config.card_mod;
    } else if (!newConfig.custom_card_mod || typeof newConfig.custom_card_mod !== 'object') {
      newConfig.custom_card_mod = {};
    }

    // Check if config actually changed
    if (!this._hasConfigChanged(newConfig)) {
      debugLog("Config unchanged, skipping update");
      return;
    }

    // Save the old config for comparison
    const oldConfig = this._config;
    this._config = newConfig;
    this._lastConfig = JSON.parse(JSON.stringify(newConfig));

    debugLog("Config after processing:", JSON.stringify(this._config));

    // Apply styles immediately for better perceived performance
    this._applyCardModStyles();

    // If already initialized, determine if we need a full rebuild or just updates
    if (this.initialized) {
      // Clear any pending config update timer
      if (this._configUpdateTimer) {
        clearTimeout(this._configUpdateTimer);
      }

      // Check if we need a full rebuild
      const needsRebuild = this._needsFullRebuild(oldConfig, newConfig);

      if (needsRebuild) {
        // Debounce the rebuild for better performance during rapid config changes
        this._configUpdateTimer = setTimeout(() => {
          debugLog("Rebuilding TodoSwipeCard due to significant config change");
          this._build().then(() => {
            // Apply transition properties after rebuild
            this._applyTransitionProperties();
            this._applyDeleteButtonColor();
          });
        }, 300); // Increased debounce time
      } else {
        // Just update the specific features without rebuild
        this._updateFromConfig(oldConfig);
        this._applyTransitionProperties();
        this._applyDeleteButtonColor();
      }
    }
  }

  /**
   * Determine if a full rebuild is needed based on config changes
   * @param {Object} oldConfig - Previous configuration
   * @param {Object} newConfig - New configuration
   * @returns {boolean} True if full rebuild needed
   * @private
   */
  _needsFullRebuild(oldConfig, newConfig) {
    if (!oldConfig) return true;

    // Check for changes that require full rebuild
    const entitiesChanged = JSON.stringify(oldConfig.entities) !== JSON.stringify(newConfig.entities);
    const backgroundImagesChanged = JSON.stringify(oldConfig.background_images) !== JSON.stringify(newConfig.background_images);
    const paginationChanged = oldConfig.show_pagination !== newConfig.show_pagination;
    const createFieldChanged = oldConfig.show_create !== newConfig.show_create;
    const cardModChanged = JSON.stringify(oldConfig.card_mod) !== JSON.stringify(newConfig.card_mod);

    return entitiesChanged || backgroundImagesChanged || paginationChanged || createFieldChanged || cardModChanged;
  }

  /**
   * Updates specific card features without a full rebuild
   * Optimized version
   * @param {Object} oldConfig - Previous configuration
   * @private
   */
  _updateFromConfig(oldConfig) {
    debugLog("Applying minor config updates");
    
    // Batch DOM updates using requestAnimationFrame
    requestAnimationFrame(() => {
      // Update show_completed setting
      if (this._config.show_completed !== oldConfig.show_completed) {
        this.cards.forEach(card => {
          if (card.element && card.element.shadowRoot) {
            const items = card.element.shadowRoot.querySelectorAll('ha-check-list-item.editRow.completed');
            items.forEach(item => {
              item.style.display = this._config.show_completed ? '' : 'none';
            });
          }
        });
      }
      
      // Update show_completed_menu setting
      if (this._config.show_completed_menu !== oldConfig.show_completed_menu || 
          this._config.show_completed !== oldConfig.show_completed) {
        this._updateDeleteButtons();
      }
      
      // Update card spacing
      if (this._config.card_spacing !== oldConfig.card_spacing) {
        if (this.sliderElement) {
          this.sliderElement.style.gap = `${this._config.card_spacing}px`;
          this.updateSlider(false); // Update without animation
        }
      }
      
      // Apply pagination styles if they changed
      if (this._config.card_mod !== oldConfig.card_mod) {
        this._applyCardModStyles();
        if (this.paginationElement) {
          this._applyPaginationStyles();
        }
      }
    });
  }

  /**
   * Update delete buttons for all cards
   * @private
   */
  _updateDeleteButtons() {
    this.cards.forEach((card, index) => {
      const slide = card.slide;
      if (!slide) return;
      
      // Remove existing delete buttons
      const oldButtons = slide.querySelectorAll('.delete-completed-button');
      oldButtons.forEach(btn => btn.remove());
      
      // Add delete button if configured to show completed items and menu
      if (this._config.show_completed && this._config.show_completed_menu) {
        const deleteButton = this._createDeleteButton(card.entityId);
        slide.appendChild(deleteButton);
      }
    });
  }

  /**
   * Create a delete button element
   * @param {string} entityId - Entity ID for the todo list
   * @returns {HTMLElement} Delete button element
   * @private
   */
  _createDeleteButton(entityId) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-completed-button';
    deleteButton.title = 'Delete completed items';
    deleteButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
      </svg>
    `;
    
    // Apply delete button color if available
    if (this._deleteButtonColor) {
      deleteButton.style.color = this._deleteButtonColor;
      const svg = deleteButton.querySelector('svg');
      if (svg) {
        svg.style.fill = this._deleteButtonColor;
      }
    }
    
    // Add click handler for the delete button with confirmation dialog
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if confirmation is required
      if (this._config.delete_confirmation) {
        this._showDeleteConfirmation(entityId);
      } else {
        // No confirmation needed, delete immediately
        this._deleteCompletedItems(entityId);
      }
    });
    
    return deleteButton;
  }

  /**
   * Show delete confirmation dialog
   * @param {string} entityId - Entity ID for the todo list
   * @private
   */
  _showDeleteConfirmation(entityId) {
    // Create confirmation dialog
    const dialog = document.createElement('ha-dialog');
    dialog.heading = 'Confirm Deletion';
    dialog.open = true;
    
    // Create content container
    const content = document.createElement('div');
    content.innerText = 'Are you sure you want to delete all completed items from the list?';
    dialog.appendChild(content);
    
    // Create confirm button
    const confirmButton = document.createElement('mwc-button');
    confirmButton.slot = 'primaryAction';
    confirmButton.label = 'Confirm';
    confirmButton.style.color = 'var(--primary-color)';
    confirmButton.setAttribute('aria-label', 'Confirm');
    
    // Add confirm button click handler
    confirmButton.addEventListener('click', () => {
      dialog.parentNode.removeChild(dialog);
      this._deleteCompletedItems(entityId);
    });
    
    // Create cancel button
    const cancelButton = document.createElement('mwc-button');
    cancelButton.slot = 'secondaryAction';
    cancelButton.label = 'Cancel';
    cancelButton.setAttribute('aria-label', 'Cancel');
    
    // Add cancel button click handler
    cancelButton.addEventListener('click', () => {
      dialog.parentNode.removeChild(dialog);
    });
    
    // Append buttons to dialog
    dialog.appendChild(confirmButton);
    dialog.appendChild(cancelButton);
    
    // Add dialog to document
    document.body.appendChild(dialog);
  }

  /**
   * Delete completed items from a todo list
   * @param {string} entityId - Entity ID for the todo list
   * @private
   */
  _deleteCompletedItems(entityId) {
    if (this._hass) {
      this._hass.callService('todo', 'remove_completed_items', {
        entity_id: entityId
      });
    }
  }

  /**
   * Set the hass object and update all child cards with throttling
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) return;
    
    // Store the new hass object
    const previousHass = this._hass;
    this._hass = hass;
    
    // Skip if we're not initialized or have no cards
    if (!this.initialized || !this.cards || this.cards.length === 0) {
      return;
    }
    
    // Clear any existing throttle timer
    if (this._updateThrottle) {
      clearTimeout(this._updateThrottle);
    }
    
    // Throttle updates to prevent flooding
    this._updateThrottle = setTimeout(() => {
      // Check if we should update child cards based on entity changes
      if (this._shouldUpdateChildCards(hass)) {
        debugLog("Updating child cards due to entity changes");
        
        // Update child cards in a batch
        requestAnimationFrame(() => {
          // Double-check cards still exist after RAF
          if (!this.cards) return;
          
          this.cards.forEach(card => {
            if (card && card.element) {
              try {
                // Only update if the card element exists and is connected
                if (card.element.isConnected) {
                  card.element.hass = hass;
                }
              } catch (e) {
                console.error("Error setting hass on child card:", e);
              }
            }
          });
        });
      }
      
      this._updateThrottle = null;
    }, 100); // 100ms throttle to batch rapid updates
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback() {
    // Ensure we have a valid config before proceeding
    if (!this._config) {
      debugLog("TodoSwipeCard connected but no config available");
      return;
    }
    
    if (!this.initialized) {
      debugLog("TodoSwipeCard connecting and building");
      this._applyCardModStyles(); // Apply styles first for transitions
      this._build();
    }
  }

  /**
   * Called when the element is disconnected from the DOM
   * Improved cleanup for better memory management
   */
  disconnectedCallback() {
    debugLog("TodoSwipeCard disconnecting");
    
    // Clear all timers
    if (this._configUpdateTimer) {
      clearTimeout(this._configUpdateTimer);
      this._configUpdateTimer = null;
    }
    
    if (this._updateThrottle) {
      clearTimeout(this._updateThrottle);
      this._updateThrottle = null;
    }
    
    // Clear resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Clear style cache but don't null it out - it might be accessed during transitions
    if (this._styleCache) {
      this._styleCache.clear();
    }
    
    // Clean up menu observers
    if (this._menuObservers) {
      this._menuObservers.forEach(observer => observer.disconnect());
      this._menuObservers = [];
    }
    
    // Properly remove swipe gesture handlers
    if (this.cardContainer) {
      if (this._touchStartHandler) {
        this.cardContainer.removeEventListener('touchstart', this._touchStartHandler);
        this.cardContainer.removeEventListener('touchmove', this._touchMoveHandler);
        this.cardContainer.removeEventListener('touchend', this._touchEndHandler);
        this.cardContainer.removeEventListener('touchcancel', this._touchEndHandler);
        this.cardContainer.removeEventListener('mousedown', this._mouseDownHandler);
      }
      
      // Clean up window event listeners that might have been added
      window.removeEventListener('mousemove', this._mouseMoveHandler);
      window.removeEventListener('mouseup', this._mouseUpHandler);
    }
    
    // Clean up card elements 
    if (this.cards) {
      this.cards.forEach(card => {
        if (card && card.element) {
          // Don't null out hass during disconnect - it might be needed
          // card.element.hass = null;
        }
      });
    }
    
    // Mark as not initialized but keep critical references
    this.initialized = false;
    
    // Clear DOM references only
    this.cards = [];
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    
    // Only clear shadowRoot content if it exists
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }
  }

  /**
   * Build the card UI with optimized DOM handling
   * Now returns a promise for better async handling
   * @private
   */
  async _build() {
    // Prevent concurrent builds
    if (this._buildPromise) {
      debugLog("Build already in progress, waiting...");
      return this._buildPromise;
    }
    
    this._buildPromise = this._doBuild();
    
    try {
      await this._buildPromise;
    } finally {
      this._buildPromise = null;
    }
  }

  /**
   * Actually perform the build
   * @private
   */
  async _doBuild() {
    debugLog("Starting build...");

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const root = this.shadowRoot;
    root.innerHTML = ''; // Clear previous content

    // Add base styles
    const style = this._createBaseStyles();
    fragment.appendChild(style);
    
    // Re-add the dynamic style element if it exists
    if (this._dynamicStyleElement) {
      fragment.appendChild(this._dynamicStyleElement);
    }

    // Check if we should show the preview (no valid entities configured)
    if (!this._hasValidEntities()) {
      this._buildPreview(fragment);
      root.appendChild(fragment);
      this.initialized = true;
      debugLog("Preview build completed");
      return;
    }

    // Regular card layout - only proceed if we have valid entities
    debugLog("Building regular card layout");
    
    // Create container
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-container';

    // Create slider
    this.sliderElement = document.createElement('div');
    this.sliderElement.className = 'slider';
    this.cardContainer.appendChild(this.sliderElement);
    fragment.appendChild(this.cardContainer);

    // Load card helpers (cache for reuse)
    if (!this._cardHelpers) {
      this._cardHelpers = await window.loadCardHelpers();
      if (!this._cardHelpers) {
        console.error("TodoSwipeCard: Card helpers not loaded");
        const errorAlert = document.createElement('ha-alert');
        errorAlert.setAttribute('alert-type', 'error');
        errorAlert.textContent = "Card Helpers are required for this card to function.";
        root.appendChild(errorAlert);
        this.initialized = false;
        return;
      }
    }
    
    this.cards = [];

    // Create slides for each todo entity
    await this._createTodoCards(this._cardHelpers);

    // Create pagination if enabled (and more than one card)
    if (this._config.show_pagination !== false && this.cards.length > 1) {
      this._createPagination();
    } else {
      this.paginationElement = null;
    }

    // Only at the end, append to the DOM
    root.appendChild(fragment);

    // Initial positioning requires element dimensions, wait for next frame
    requestAnimationFrame(() => {
      if (!this.cardContainer) {
        return;
      }
      
      this.slideWidth = this.cardContainer.offsetWidth;
      // Ensure currentIndex is valid before updating slider
      this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.cards.length - 1));
      
      // Apply border radius to all slides
      const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
      this.cards.forEach(cardData => {
        if (cardData.slide) {
          cardData.slide.style.borderRadius = cardBorderRadius;
        }
      });
      
      this.updateSlider(false); // Update without animation initially

      // Setup resize observer only after initial layout
      this._setupResizeObserver();
    });

    // Add swipe detection only if more than one card
    if (this.cards.length > 1) {
      this._addSwiperGesture();
    }

    // Set up menu button observers with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this._setupMenuButtonObservers();
    }, 100);

    // Apply transition properties
    setTimeout(() => {
      this._applyTransitionProperties();
    }, 200);

    // Mark as initialized AFTER build completes
    this.initialized = true;
    debugLog("Regular card build completed.");
  }

  /**
   * Create base styles for the card
   * @returns {HTMLStyleElement} Style element
   * @private
   */
  _createBaseStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 100%;
        --card-border-radius: var(--ha-card-border-radius, 12px);
        border-radius: var(--card-border-radius);
      }

      .card-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: var(--card-border-radius);
      }
      
      .card-container, .slide, ha-card {
        border-radius: var(--card-border-radius) !important;
      }

      .slider {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-out;
        will-change: transform;
      }

      .slide {
        position: relative;
        flex: 0 0 100%;
        max-width: 100%;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
        border-radius: var(--card-border-radius);
        background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));
      }

      .pagination {
        position: absolute;
        bottom: var(--todo-swipe-card-pagination-bottom, 8px);
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        background-color: var(--todo-swipe-card-pagination-background, transparent);
      }

      .pagination-dot {
        width: var(--todo-swipe-card-pagination-dot-size, 8px);
        height: var(--todo-swipe-card-pagination-dot-size, 8px);
        border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);
        margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);
        background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
        cursor: pointer;
        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
        flex-shrink: 0;
      }

      .pagination-dot.active {
        background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
        width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
        height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
      }
      
      .delete-completed-button {
        position: absolute;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 35px;
        padding: 4px;
        background-color: transparent;
        border: none;
        color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
        cursor: pointer;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        z-index: 10;
      }

      .delete-completed-button:hover {
        background-color: rgba(127, 127, 127, 0.2);
      }

      .delete-completed-button svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      /* Global style to ensure all three-dots menus are hidden */
      ::shadow ha-button-menu,
      ::part(ha-button-menu),
      ha-button-menu,
      .header ha-button-menu,
      [id*="menu"],
      [class*="menu-button"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* Preview styles */
      .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: inherit;
      }
      
      .preview-icon-container {
        margin-bottom: 16px;
      }
      
      .preview-icon-container ha-icon {
        color: var(--primary-color, #03a9f4);
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
      
      .preview-text-container {
        margin-bottom: 16px;
      }
      
      .preview-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--primary-text-color);
      }
      
      .preview-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        max-width: 300px;
        line-height: 1.4;
        margin: 0 auto;
      }
      
      /* Dialog styles */
      ha-dialog {
        --mdc-dialog-min-width: 300px;
        --mdc-dialog-max-width: 500px;
        --mdc-dialog-heading-ink-color: var(--primary-text-color);
        --mdc-dialog-content-ink-color: var(--primary-text-color);
        --justify-action-buttons: space-between;
      }
      
      ha-dialog div {
        padding: 8px 16px 16px 16px;
        color: var(--primary-text-color);
      }
    `;
    
    return style;
  }

  /**
   * Build preview state
   * @param {DocumentFragment} fragment - Document fragment to append to
   * @private
   */
  _buildPreview(fragment) {
    debugLog("Building preview state");
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    
    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'preview-icon-container';
    const icon = document.createElement('ha-icon');
    icon.icon = 'mdi:format-list-checks';
    iconContainer.appendChild(icon);
    
    // Text container
    const textContainer = document.createElement('div');
    textContainer.className = 'preview-text-container';
    
    // Title
    const title = document.createElement('div');
    title.className = 'preview-title';
    title.textContent = 'Todo Swipe Card';
    
    // Description
    const description = document.createElement('div');
    description.className = 'preview-description';
    description.textContent = 'A specialized swipe card for todo lists with built-in styling. Supports multiple lists with swipe navigation.';
    
    textContainer.appendChild(title);
    textContainer.appendChild(description);
    
    // Button
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'preview-actions';
    const editButton = document.createElement('ha-button');
    editButton.raised = true;
    editButton.textContent = 'EDIT CARD';
    editButton.setAttribute('aria-label', 'Edit Card');
    editButton.addEventListener('click', this._handleEditClick.bind(this));
    actionsContainer.appendChild(editButton);
    
    // Append all elements
    previewContainer.appendChild(iconContainer);
    previewContainer.appendChild(textContainer);
    previewContainer.appendChild(actionsContainer);
    
    fragment.appendChild(previewContainer);
  }

  /**
   * Create pagination element
   * @private
   */
  _createPagination() {
    this.paginationElement = document.createElement('div');
    this.paginationElement.className = 'pagination';

    for (let i = 0; i < this.cards.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'pagination-dot';
      if (i === this.currentIndex) dot.classList.add('active');

      // Add click handler to dots
      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });

      this.paginationElement.appendChild(dot);
    }

    this.cardContainer.appendChild(this.paginationElement);
    
    // Apply pagination styles
    this._applyPaginationStyles();
  }

  /**
   * Create todo cards from entities
   * Optimized version with better error handling
   * @param {Object} helpers - Card helpers from Home Assistant
   * @private
   */
  async _createTodoCards(helpers) {
    // Process entities in chunks for better performance with many cards
    const entityBatches = [];
    const batchSize = 3; // Process 3 entities at a time
    
    for (let i = 0; i < this._config.entities.length; i += batchSize) {
      entityBatches.push(this._config.entities.slice(i, i + batchSize));
    }
    
    // Process batches sequentially
    for (const batch of entityBatches) {
      await Promise.all(batch.map(async (entityId, batchIndex) => {
        const i = this._config.entities.indexOf(entityId);
        if (!entityId || entityId.trim() === "") {
          debugLog("Skipping empty entity at index", i);
          return null;
        }

        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';

        try {
          // Create card element
          const cardElement = await this._createSingleTodoCard(helpers, entityId);
          
          // Pass hass immediately if available
          if (this._hass) {
            cardElement.hass = this._hass;
          }
          
          // Store reference to the card
          this.cards[i] = {
            element: cardElement,
            slide: slideDiv,
            entityId: entityId
          };
          
          // Add card to slide
          slideDiv.appendChild(cardElement);
          
          // Add custom delete button if configured
          if (this._config.show_completed && this._config.show_completed_menu) {
            const deleteButton = this._createDeleteButton(entityId);
            slideDiv.appendChild(deleteButton);
          }
          
          this.sliderElement.appendChild(slideDiv);
          
          // Process menus after a slight delay to ensure DOM is ready
          setTimeout(() => {
            this._hideMenusInRoot(cardElement.shadowRoot);
          }, 50);
          
          // Setup input field enhancements
          this._enhanceInputField(cardElement);
          
        } catch (e) {
          console.error(`Error creating card ${i}:`, entityId, e);
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = "color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;";
          errorDiv.textContent = `Error creating card: ${e.message || e}. Check console for details.`;
          slideDiv.appendChild(errorDiv);
          this.sliderElement.appendChild(slideDiv);
          this.cards[i] = { error: true, slide: slideDiv };
        }
      }));
    }
    
    // Filter out any potential gaps if errors occurred
    this.cards = this.cards.filter(Boolean);
  }

  /**
   * Create a single todo card
   * @param {Object} helpers - Card helpers
   * @param {string} entityId - Entity ID
   * @returns {Promise<HTMLElement>} Card element
   * @private
   */
  async _createSingleTodoCard(helpers, entityId) {
    debugLog("Creating card for entity:", entityId);
    
    // Generate internal styles for this card
    const internalStyles = this._generateInternalStyles(entityId);
    
    // Get custom card mod styling from config
    const customCardModStyle = this._config.card_mod || this._config.custom_card_mod || {};
    
    // Merge internal and custom styling using the optimized method
    const mergedCardModStyle = this._mergeCardModStyles(internalStyles, customCardModStyle);
    
    // Create the todo-list card with merged card-mod styling
    const cardConfig = {
      type: 'todo-list',
      entity: entityId,
      hide_create: !this._config.show_create,
      hide_completed: !this._config.show_completed,
      card_mod: {
        style: mergedCardModStyle
      }
    };
    
    return await helpers.createCardElement(cardConfig);
  }

  /**
   * Generate internal styles for a todo card
   * Fixed version that maintains original visual appearance
   * @param {string} entityId - Entity ID
   * @returns {Object} Internal card mod styles
   * @private
   */
  _generateInternalStyles(entityId) {
    // Get background image if configured
    const backgroundImages = this._config.background_images || {};
    const backgroundImage = backgroundImages[entityId] || null;
    
    // Determine if Add button should be shown
    const showAddButton = this._config.show_addbutton !== undefined ? 
                          this._config.show_addbutton : false;
    
    // Use CSS variables for all colors with proper fallbacks
    // No forced opacity - let CSS variables control everything
    let textColor = `var(--todo-swipe-card-text-color, var(--primary-text-color))`;
    let checkboxColor = `var(--todo-swipe-card-checkbox-color, ${textColor})`;
    let checkboxCheckedColor = `var(--todo-swipe-card-checkbox-checked-color, var(--primary-color))`;
    let checkboxCheckmarkColor = `var(--todo-swipe-card-checkbox-checkmark-color, var(--primary-text-color))`;
    let addButtonColor = `var(--todo-swipe-card-add-button-color, ${textColor})`;
    let deleteButtonColor = `var(--todo-swipe-card-delete-button-color, ${textColor})`;
    
    return {
      'ha-textfield': {
        $: `
          /* Input styling with text cutoff before add button */
          .mdc-text-field__input {
            color: ${textColor} !important;
            max-width: calc(100% - 13px) !important; /* Reserve space for add button plus 5px margin */
            padding-right: 10px !important; /* Ensure adequate spacing from add button */
            margin-left: -4px !important; /* Fine-tune alignment with checkboxes */
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;
          }
          
          /* Text field container adjustment */
          .mdc-text-field {
            --mdc-text-field-fill-color: transparent;
            height: auto !important;
            --text-field-padding: 0px 13px 5px 5px; /* Adjust right padding for add button space */
            position: relative !important;
          }
          
          /* Basic field styling */
          .mdc-text-field {
            --mdc-text-field-fill-color: transparent;
            height: auto !important;
            --text-field-padding: 0px 0px 5px 5px;
          }

          /* Remove underline */
          .mdc-line-ripple::before,
          .mdc-line-ripple::after {
            border-bottom-style: none !important;
          }

          /* Floating label styling with CSS variable control */
          .mdc-floating-label,
          .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label,
          .mdc-text-field .mdc-floating-label,
          .mdc-floating-label--float-above {
            color: var(--todo-swipe-card-floating-label-color, ${textColor}) !important;
            opacity: var(--todo-swipe-card-floating-label-opacity, 1) !important;
          }
          
          /* Placeholder text styling with CSS variable control */
          .mdc-text-field__input::placeholder {
            color: var(--todo-swipe-card-placeholder-color, ${textColor}) !important;
            opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
          }
          
          /* Cross-browser placeholder support */
          .mdc-text-field__input::-webkit-input-placeholder {
            color: var(--todo-swipe-card-placeholder-color, ${textColor}) !important;
            opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
          }
          
          .mdc-text-field__input::-moz-placeholder {
            color: var(--todo-swipe-card-placeholder-color, ${textColor}) !important;
            opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
          }
          
          .mdc-text-field__input:-ms-input-placeholder {
            color: var(--todo-swipe-card-placeholder-color, ${textColor}) !important;
            opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
          }
        `
      },
      '.': `

        ha-card {
          --mdc-typography-subtitle1-font-size: var(--todo-swipe-card-typography-size, 11px);
          box-shadow: none;
          height: 100% !important;
          width: 100%;
          max-height: none;
          overflow-y: auto;
          border-radius: inherit;
          color: ${textColor};

          /* Apply background image with higher specificity if provided */
          ${backgroundImage ? 
            `background-image: url('${backgroundImage}') !important; 
            background-position: center center !important; 
            background-repeat: no-repeat !important;
            background-size: cover !important;
            background-color: transparent !important;` : 
            `background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white))) !important;`
          }
        }

        /* Apply consistent color to text elements but no forced opacity */
        ha-card *,
        ha-check-list-item,
        ha-check-list-item *,
        .mdc-list-item__text,
        .mdc-list-item__primary-text {
          color: ${textColor} !important;
        }

        :host {
          /* Establish color hierarchy for proper inheritance */
          --todo-swipe-card-text-color: var(--todo-swipe-card-text-color, var(--primary-text-color));
          --todo-swipe-card-delete-button-color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));

          /* Checkbox styling with CSS variable control */
          --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 20px);
          --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 20px);
          
          /* Text field styling */
          --mdc-text-field-idle-line-color: var(--todo-swipe-card-field-line-color, grey);
          --mdc-text-field-hover-line-color: var(--todo-swipe-card-field-line-color, grey);
          --mdc-text-field-outlined-idle-border-color: var(--todo-swipe-card-field-line-color, grey);
          --mdc-text-field-outlined-hover-border-color: var(--todo-swipe-card-field-line-color, grey);
          
          /* Primary color */
          --mdc-theme-primary: var(--todo-swipe-card-primary-color, grey);
          
          /* Border radius handling */
          --card-border-radius: var(--ha-card-border-radius, 12px);
          border-radius: var(--card-border-radius);
          
          /* Checkbox colors with CSS variable control */
          --mdc-checkbox-unchecked-color: ${checkboxColor} !important;
          --mdc-checkbox-checked-color: ${checkboxCheckedColor} !important;
          --mdc-checkbox-selected-checkmark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-mark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-ink-color: ${checkboxCheckmarkColor} !important;
        }

        /* Checkbox styling with CSS variable opacity control */
        ha-checkbox {
          opacity: var(--todo-swipe-card-checkbox-opacity, 1) !important;
          --mdc-checkbox-unchecked-color: ${checkboxColor} !important;
          --mdc-checkbox-checked-color: ${checkboxCheckedColor} !important;
          --mdc-checkbox-selected-checkmark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-mark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-ink-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-disabled-color: rgba(0, 0, 0, 0.38) !important;
        }

        /* Direct SVG path targeting for checkmark */
        ha-checkbox svg path {
          fill: ${checkboxCheckmarkColor} !important;
        }

        /* Alternative approach - target the checkmark more specifically */
        ha-checkbox .mdc-checkbox__checkmark-path {
          stroke: ${checkboxCheckmarkColor} !important;
        }

        /* Input field styling - no forced opacity */
        .mdc-text-field__input {
          color: ${textColor} !important;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        /* Hide "No tasks to do" text */
        p.empty {
          display: none;
        }

        /* Control the Add button visibility with consistent styling */
        ${!showAddButton ? `
        ha-icon-button.addButton {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          overflow: hidden !important;
          opacity: 0 !important;
          left: -9999px !important;
          top: -9999px !important;
        }` : `
        ha-icon-button.addButton {
          position: absolute !important;
          right: 1px !important;
          top: 0px !important;
          z-index: 10 !important;
          color: ${addButtonColor} !important;
        }
        
        ha-icon-button.addButton svg,
        ha-icon-button.addButton ha-icon {
          color: ${addButtonColor} !important;
          fill: ${addButtonColor} !important;
        }`}

        /* Hide all headers and menus */
        ha-card.type-todo-list div.header h2,
        ha-card.type-todo-list div.header ha-button-menu,
        ha-button-menu {
          display: none !important;
        }

        /* Hide separator and completed header */
        ha-card.type-todo-list div.divider,
        ha-card.type-todo-list div.header:nth-of-type(2) {
          display: none !important;
        }

        /* Hide completed items if not configured to show */
        ${!this._config.show_completed ? 'ha-check-list-item.editRow.completed { display: none; }' : ''}
        
        /* Hide reorder buttons */
        ha-icon-button.reorderButton {
          display: none !important;
        }

        /* List item height and spacing with text cutoff before trash icon */
        ha-check-list-item {
          min-height: var(--todo-swipe-card-item-height, 0px) !important;
          --mdc-list-item-graphic-margin: var(--todo-swipe-card-item-margin, 5px) !important;
          color: ${textColor} !important;
          padding-right: 40px !important; /* Reserve space for delete button plus 5px margin */
        }

        /* Text content styling with cutoff */
        ha-check-list-item .mdc-list-item__text,
        ha-check-list-item .mdc-list-item__primary-text {
          max-width: calc(100% - 70px) !important; /* Account for checkbox (30px) + delete button (40px) + spacing (5px) */
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          color: ${textColor} !important;
        }

        /* Content area constraint */
        ha-check-list-item .mdc-list-item__content {
          max-width: calc(100% - 75px) !important;
          overflow: hidden !important;
        }
      `
    };
  }

  /**
   * Enhance input field for better mobile experience
   * @param {HTMLElement} cardElement - Card element
   * @private
   */
  _enhanceInputField(cardElement) {
    if (!cardElement || !cardElement.shadowRoot) return;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const textField = cardElement.shadowRoot.querySelector('ha-textfield');
      if (!textField || !textField.shadowRoot) return;
      
      const inputElement = textField.shadowRoot.querySelector('input');
      if (!inputElement) return;
      
      // Set enterKeyHint for mobile keyboards
      inputElement.enterKeyHint = 'done';
      
      // Add a focused class to improve touch response
      textField.addEventListener('click', () => {
        if (inputElement) {
          inputElement.focus();
        }
      });
      
      debugLog("Enhanced input field setup successfully");
    });
  }

  /**
   * Setup resize observer with improved debounce
   * @private 
   */
  _setupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    let resizeTimeout;
    this.resizeObserver = new ResizeObserver(() => {
      // Clear existing timeout
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      // Debounce resize handling
      resizeTimeout = setTimeout(() => {
        if (!this.cardContainer) return;
        
        const newWidth = this.cardContainer.offsetWidth;
        // Only update if width actually changed significantly
        if (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) {
          debugLog("Resizing slider...");
          this.slideWidth = newWidth;
          
          // Batch DOM updates
          requestAnimationFrame(() => {
            // Reapply border radius when resizing
            const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
            this.cards.forEach(cardData => {
              if (cardData.slide) {
                cardData.slide.style.borderRadius = cardBorderRadius;
              }
            });
            
            this.updateSlider(false); // Update without animation on resize
          });
        }
      }, 200); // Increased debounce time
    });

    if (this.cardContainer) {
      this.resizeObserver.observe(this.cardContainer);
    }
  }
  
  /**
   * Apply pagination-specific styles from card_mod
   * @private
   */
  _applyPaginationStyles() {
    if (!this.paginationElement) return;
    
    // Extract pagination styling from card_mod
    let paginationStyles = '';
    
    // Handle string-based card_mod style
    if (this._config.card_mod && this._config.card_mod.style && typeof this._config.card_mod.style === 'string') {
      // Look for our pagination variables in the style string
      const styleString = this._config.card_mod.style;
      const variablesToExtract = [
        '--todo-swipe-card-pagination-dot-inactive-color',
        '--todo-swipe-card-pagination-dot-active-color',
        '--todo-swipe-card-pagination-dot-size',
        '--todo-swipe-card-pagination-dot-border-radius',
        '--todo-swipe-card-pagination-dot-spacing',
        '--todo-swipe-card-pagination-bottom',
        '--todo-swipe-card-pagination-right',
        '--todo-swipe-card-pagination-background',
        '--todo-swipe-card-pagination-dot-active-size-multiplier'
      ];
      
      // For each variable, try to extract its value from the style string
      variablesToExtract.forEach(varName => {
        const regex = new RegExp(`${varName}\\s*:\\s*([^;]+)`, 'i');
        const match = styleString.match(regex);
        if (match && match[1]) {
          paginationStyles += `${varName}: ${match[1].trim()};\n`;
        }
      });
    }
    
    // If we found pagination styles, apply them directly to the pagination element
    if (paginationStyles) {
      this.paginationElement.style.cssText += paginationStyles;
      
      // Get all dots for individual styling
      const dots = this.paginationElement.querySelectorAll('.pagination-dot');
      
      // Apply special handling for individual dot properties
      requestAnimationFrame(() => {
        dots.forEach((dot, index) => {
          // Apply base styles
          dot.style.borderRadius = `var(--todo-swipe-card-pagination-dot-border-radius, 50%)`;
          dot.style.margin = `0 var(--todo-swipe-card-pagination-dot-spacing, 4px)`;
          
          // Apply size based on active state
          if (dot.classList.contains('active')) {
            dot.style.width = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
            dot.style.height = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
          } else {
            dot.style.width = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
            dot.style.height = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
          }
        });
      });
    }
  }

  /**
   * Set up optimized menu button observers
   * Uses a single observer with better performance
   * @private
   */
  _setupMenuButtonObservers() {
    debugLog("Setting up menu button observers");
    
    // Clear any existing observers
    if (this._menuObservers) {
      this._menuObservers.forEach(observer => observer.disconnect());
      this._menuObservers = [];
    }
    
    // Create a single mutation observer with debouncing
    let observerTimeout;
    const observer = new MutationObserver(mutations => {
      // Clear existing timeout
      if (observerTimeout) clearTimeout(observerTimeout);
      
      // Debounce observer callbacks
      observerTimeout = setTimeout(() => {
        let shouldCheck = false;
        
        // Check if we need to re-process
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            shouldCheck = true;
            break;
          }
        }
        
        if (shouldCheck) {
          // Use requestAnimationFrame to batch DOM updates
          requestAnimationFrame(() => {
            this.cards.forEach(card => {
              if (card && card.element && card.element.shadowRoot) {
                this._hideMenusInRoot(card.element.shadowRoot);
              }
            });
          });
        }
      }, 100);
    });
    
    // Observe all cards with a single observer
    this.cards.forEach(card => {
      if (card && card.element && card.element.shadowRoot) {
        // Hide existing menus first
        this._hideMenusInRoot(card.element.shadowRoot);
        
        // Start observing this card's shadow root
        observer.observe(card.element.shadowRoot, {
          childList: true,
          subtree: true
        });
      }
    });
    
    // Store observer for cleanup
    this._menuObservers.push(observer);
  }

  /**
   * Hide menu buttons in a DOM tree
   * Optimized version with depth limiting
   * @param {ShadowRoot|Element} root - Root element to process
   * @param {number} depth - Current recursion depth
   * @private
   */
  _hideMenusInRoot(root, depth = 0) {
    if (!root || depth > 3) return; // Limit recursion depth
    
    try {
      // Find all menu buttons in this root
      const menus = root.querySelectorAll ? root.querySelectorAll('ha-button-menu') : [];
      if (menus.length > 0) {
        // Batch style updates
        requestAnimationFrame(() => {
          menus.forEach(menu => {
            if (menu && menu.parentNode && menu.style) {
              // Apply all styles at once
              menu.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important;';
              
              // Also hide parent header if it exists
              if (menu.parentNode.classList && menu.parentNode.classList.contains('header')) {
                menu.parentNode.style.display = 'none';
                menu.parentNode.style.visibility = 'hidden';
              }
            }
          });
        });
      }
      
      // Check children with shadow roots (limited)
      if (root.querySelectorAll && depth < 3) {
        const shadowElements = root.querySelectorAll('*');
        let count = 0;
        
        for (const el of shadowElements) {
          if (count > 20) break; // Reduced limit for better performance
          if (el && el.shadowRoot) {
            this._hideMenusInRoot(el.shadowRoot, depth + 1);
            count++;
          }
        }
      }
    } catch (e) {
      console.error("Error hiding menus:", e);
    }
  }

  /**
   * Add swipe gesture handling with optimizations
   * FIXED VERSION - Comprehensive event handling approach
   * @private
   */
  _addSwiperGesture() {
    // Remove previous listeners if rebuilding to prevent duplicates
    if (this._touchStartHandler) {
      this.cardContainer.removeEventListener('touchstart', this._touchStartHandler);
      this.cardContainer.removeEventListener('touchmove', this._touchMoveHandler);
      this.cardContainer.removeEventListener('touchend', this._touchEndHandler);
      this.cardContainer.removeEventListener('touchcancel', this._touchEndHandler);
      this.cardContainer.removeEventListener('mousedown', this._mouseDownHandler);
      window.removeEventListener('mousemove', this._mouseMoveHandler);
      window.removeEventListener('mouseup', this._mouseUpHandler);
    }

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isScrolling = false;
    let initialTransform = 0;
    let isInteractiveElement = false;
    let swipeIntentionConfirmed = false;

    // Enhanced helper to check for interactive elements
    this._isInteractiveOrScrollable = (element) => {
      if (!element || element === this.cardContainer || element === this.sliderElement) return false;

      // Check for text input elements at any level
      let current = element;
      let depth = 0;
      while (current && depth < 15) {
        try {
          if (current.nodeType === Node.ELEMENT_NODE) {
            const tagName = current.localName?.toLowerCase();
            const role = current.getAttribute && current.getAttribute('role');
            
            // Direct interactive element check
            const interactiveTags = [
              'input', 'textarea', 'select', 'button', 'a', 'ha-switch', 'ha-checkbox',
              'mwc-checkbox', 'paper-checkbox', 'ha-textfield', 'ha-slider', 'paper-slider',
              'ha-icon-button', 'mwc-button', 'paper-button'
            ];
            
            if (interactiveTags.includes(tagName)) {
              return true;
            }
            
            // Role-based check
            if (role && ['button', 'checkbox', 'switch', 'slider', 'link', 'menuitem', 'textbox', 'input', 'combobox', 'searchbox'].includes(role)) {
              return true;
            }
            
            // Material Design text field classes
            if (current.classList) {
              const mdcClasses = [
                'mdc-text-field', 'mdc-text-field__input', 'mdc-text-field__ripple',
                'mdc-line-ripple', 'mdc-floating-label', 'mdc-text-field__affix'
              ];
              for (const className of mdcClasses) {
                if (current.classList.contains(className)) {
                  return true;
                }
              }
            }
            
            // Check for scrollable content
            const style = window.getComputedStyle(current);
            const overflowY = style.overflowY;
            if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight + 1) {
              return true;
            }
          }
        } catch (e) { 
          break;
        }
        
        current = current.assignedSlot || current.parentNode || (current.getRootNode && current.getRootNode().host);
        depth++;
      }

      return false;
    };

    // --- Define handlers as bound instance methods ---
    this._handleSwipeStart = (e) => {
      // Ignore if already dragging or non-primary button
      if (isDragging || (e.type === 'mousedown' && e.button !== 0)) return;

      // Check if this is an interactive element BEFORE any other processing
      isInteractiveElement = this._isInteractiveOrScrollable(e.target);
      
      // If it's an interactive element, completely skip swipe handling
      if (isInteractiveElement) {
        return;
      }

      // Initialize swipe state
      isDragging = false; // Don't set to true immediately
      isScrolling = false;
      swipeIntentionConfirmed = false;

      if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }
      currentX = startX;

      // Record initial transform but don't disable transitions yet
      if (this.sliderElement) {
        const style = window.getComputedStyle(this.sliderElement);
        const matrix = new DOMMatrixReadOnly(style.transform);
        initialTransform = matrix.m41;
      }

      // Add mouse move/up listeners to window for mouse events
      if (e.type === 'mousedown') {
        window.addEventListener('mousemove', this._mouseMoveHandler);
        window.addEventListener('mouseup', this._mouseUpHandler);
      }
    };

    this._handleSwipeMove = (e) => {
      // Skip entirely if this started on an interactive element
      if (isInteractiveElement) return;

      let moveX, moveY, clientX, clientY;

      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      moveX = clientX - startX;
      moveY = clientY - startY;

      // Determine scroll vs swipe intention early
      if (!isScrolling && !swipeIntentionConfirmed) {
        if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 15) {
          isScrolling = true;
          return;
        } else if (Math.abs(moveX) > 15) {
          swipeIntentionConfirmed = true;
          isDragging = true;
          
          // NOW disable transitions and set cursor
          if (this.sliderElement) {
            this.sliderElement.style.transition = 'none';
            this.sliderElement.style.cursor = 'grabbing';
          }
          
          // NOW prevent default only after confirming swipe intention
          if (e.cancelable) {
            e.preventDefault();
          }
        } else {
          // Movement too small, don't interfere yet
          return;
        }
      }

      // Skip if we determined this is scrolling
      if (isScrolling || !swipeIntentionConfirmed) return;

      // Prevent default only for confirmed horizontal swipes
      if (e.cancelable) {
        e.preventDefault();
      }

      currentX = clientX;

      // Calculate drag with resistance
      let totalDragOffset = currentX - startX;
      const atLeftEdge = this.currentIndex === 0;
      const atRightEdge = this.currentIndex === this.cards.length - 1;
      
      if ((atLeftEdge && totalDragOffset > 0) || (atRightEdge && totalDragOffset < 0)) {
        const overDrag = Math.abs(totalDragOffset);
        const resistanceFactor = 0.3 + 0.7 / (1 + overDrag / (this.slideWidth * 0.5));
        totalDragOffset *= resistanceFactor * 0.5;
      }

      const newTransform = initialTransform + totalDragOffset;

      if (this.sliderElement) {
        requestAnimationFrame(() => {
          this.sliderElement.style.transform = `translateX(${newTransform}px)`;
        });
      }
    };

    this._handleSwipeEnd = (e) => {
      // Remove window listeners for mouse events
      if (e.type === 'mouseup' || e.type === 'mouseleave') {
        window.removeEventListener('mousemove', this._mouseMoveHandler);
        window.removeEventListener('mouseup', this._mouseUpHandler);
      }

      // Skip if this started on an interactive element
      if (isInteractiveElement) {
        // Reset state
        isInteractiveElement = false;
        return;
      }

      const wasDragging = isDragging;
      
      // Reset all state
      isDragging = false;
      isScrolling = false;
      swipeIntentionConfirmed = false;
      isInteractiveElement = false;

      // Restore transitions and cursor
      if (this.sliderElement) {
        const transitionSpeed = this._transitionSpeed || '0.3s';
        const transitionEasing = this._transitionEasing || 'ease-out';
        this.sliderElement.style.transition = `transform ${transitionSpeed} ${transitionEasing}`;
        this.sliderElement.style.cursor = '';
      }

      // Only process swipe if we had confirmed dragging
      if (!wasDragging || e.type === 'touchcancel') {
        this.updateSlider();
        return;
      }

      // Calculate swipe distance and update slide if threshold met
      const totalMoveX = currentX - startX;
      const threshold = this.slideWidth * 0.20;

      if (Math.abs(totalMoveX) > threshold) {
        if (totalMoveX > 0 && this.currentIndex > 0) {
          this.currentIndex--;
        } else if (totalMoveX < 0 && this.currentIndex < this.cards.length - 1) {
          this.currentIndex++;
        }
      }

      this.updateSlider(true);
    };

    // Store bound handlers for removal
    this._touchStartHandler = this._handleSwipeStart.bind(this);
    this._touchMoveHandler = this._handleSwipeMove.bind(this);
    this._touchEndHandler = this._handleSwipeEnd.bind(this);
    this._mouseDownHandler = this._handleSwipeStart.bind(this);
    this._mouseMoveHandler = this._handleSwipeMove.bind(this);
    this._mouseUpHandler = this._handleSwipeEnd.bind(this);

    // Add listeners
    this.cardContainer.addEventListener('touchstart', this._touchStartHandler, { passive: true });
    this.cardContainer.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
    this.cardContainer.addEventListener('touchend', this._touchEndHandler, { passive: true });
    this.cardContainer.addEventListener('touchcancel', this._touchEndHandler, { passive: true });
    this.cardContainer.addEventListener('mousedown', this._mouseDownHandler);
  }

  /**
   * Navigate to a specific slide
   * @param {number} index - The slide index to go to
   */
  goToSlide(index) {
    if (!this.cards || this.cards.length === 0 || !this.initialized) return;
    
    index = Math.max(0, Math.min(index, this.cards.length - 1));

    if (index === this.currentIndex) return;

    this.currentIndex = index;
    this.updateSlider();
  }

  /**
   * Update slider position and pagination
   * Optimized version with batched DOM updates
   * @param {boolean} animate - Whether to animate the transition
   */
  updateSlider(animate = true) {
    if (!this.sliderElement || !this.slideWidth || this.cards.length === 0 || !this.initialized) {
      return;
    }

    // Batch all DOM updates
    requestAnimationFrame(() => {
      // Use stored transition values if available, otherwise default
      const transitionSpeed = this._transitionSpeed || '0.3s';
      const transitionEasing = this._transitionEasing || 'ease-out';

      // Set transition based on animate parameter
      this.sliderElement.style.transition = animate 
        ? `transform ${transitionSpeed} ${transitionEasing}` 
        : 'none';

      // Get card spacing from config
      const cardSpacing = this._config.card_spacing || 0;

      // Update slider gap for spacing
      this.sliderElement.style.gap = `${cardSpacing}px`;

      // Calculate transform using pixel values including spacing
      const translateX = this.currentIndex * (this.slideWidth + cardSpacing);
      this.sliderElement.style.transform = `translateX(-${translateX}px)`;

      // Get the border radius from the container and apply to all slides
      const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
      this.cards.forEach((card) => {
        if (card.slide) {
          card.slide.style.marginRight = '0px'; // Ensure margins are reset
          card.slide.style.borderRadius = cardBorderRadius; // Apply border radius to slides
        }
      });

      // Update pagination
      if (this.paginationElement) {
        const dots = this.paginationElement.querySelectorAll('.pagination-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === this.currentIndex);
        });
        
        // Apply pagination styles
        this._applyPaginationStyles();
      }
    });
  }

  /**
   * Get card size for Home Assistant layout system
   * @returns {number} Card size
   */
  getCardSize() {
    return 3;
  }
}

/**
 * Card editor for TodoSwipeCard
 */
class TodoSwipeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Force render update when the editor is connected to the DOM
    debugLog("TodoSwipeCardEditor - Connected to DOM");
    
    // Use a delayed update to avoid multiple reflows
    if (!this._initialUpdateDone) {
      this._initialUpdateDone = true;
      requestAnimationFrame(() => {
        this.requestUpdate();
      });
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Only update entities if configuration has changed, with debounce
    if (changedProperties.has('_config') && this._config) {
      // Only check for entity pickers if really needed
      if (this._config.entities && this._config.entities.length > 0) {
        // Batch DOM checks with requestAnimationFrame for better performance
        if (this._updateRAF) {
          cancelAnimationFrame(this._updateRAF);
        }
        
        this._updateRAF = requestAnimationFrame(() => {
          const entityPickers = this.shadowRoot.querySelectorAll('ha-entity-picker');
          if (entityPickers.length === 0 || entityPickers.length < this._config.entities.length) {
            this.requestUpdate();
          }
          this._updateRAF = null;
        });
      }
    }
  }

  setConfig(config) {
    debugLog("Editor setConfig called with:", JSON.stringify(config));
    
    // Start with the stub config for defaults
    this._config = {
      ...TodoSwipeCard.getStubConfig()
    };
    
    // Then apply the provided config
    if (config) {
      // Handle entities specially to ensure it's always an array
      let entities = config.entities || [];
      if (!Array.isArray(entities)) {
        if (typeof entities === 'object') {
          entities = Object.values(entities);
        } else if (typeof entities === 'string') {
          entities = [entities];
        } else {
          entities = [];
        }
      }
      
      // Filter out empty entries
      entities = entities.filter(e => e && e.trim() !== "");
      
      // Ensure card_spacing is a valid number
      let cardSpacing = config.card_spacing;
      if (cardSpacing === undefined) {
        cardSpacing = 15; // Default spacing
      } else {
        cardSpacing = parseInt(cardSpacing);
        if (isNaN(cardSpacing) || cardSpacing < 0) {
          cardSpacing = 15;
        }
      }
      
      // Ensure custom_card_mod is an object
      let customCardMod = config.custom_card_mod;
      if (!customCardMod || typeof customCardMod !== 'object') {
        customCardMod = {};
      }
      
      // Merge config, overriding stub with provided values plus our cleaned entities and spacing
      this._config = {
        ...this._config,
        ...config,
        entities,
        card_spacing: cardSpacing,
        custom_card_mod: customCardMod
      };
    }
    
    // Ensure background_images is an object
    if (!this._config.background_images || typeof this._config.background_images !== 'object') {
      this._config.background_images = {};
    }
    
    debugLog("TodoSwipeCardEditor - Config after initialization:", JSON.stringify(this._config));
    
    // Force a render update to ensure entities display correctly
    this.requestUpdate();
  }

  get _show_pagination() {
    return this._config.show_pagination !== false;
  }

  get _show_addbutton() {
    return this._config.show_addbutton === true;
  }

  get _show_create() {
    return this._config.show_create !== false;
  }

  get _show_completed() {
    return this._config.show_completed === true;
  }

  get _show_completed_menu() {
    return this._config.show_completed_menu === true;
  }
  
  get _delete_confirmation() {
    return this._config.delete_confirmation === true;
  }

  get _card_spacing() {
    return this._config.card_spacing !== undefined ? this._config.card_spacing : 15;
  }

  // Get a list of valid entities (not empty strings)
  get _validEntities() {
    return (this._config.entities || []).filter(entity => entity && entity.trim() !== "");
  }

  // Check if we should show the background images section
  get _showBackgroundImagesSection() {
    return this._validEntities.length > 0;
  }

  // Check if we should show the completed menu option
  get _showCompletedMenuOption() {
    return this._show_completed;
  }
  
  // Check if we should show the delete confirmation option
  get _showDeleteConfirmationOption() {
    return this._show_completed && this._show_completed_menu;
  }

  // This static method ensures the editor UI refreshes properly when reopened
  static get styles() {
    return css`
      ha-switch {
        padding: 8px 0;
      }
      .side-by-side {
        display: flex;
        align-items: center;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 8px;
      }
      .entity-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        width: 100%;
      }
      .entity-row ha-entity-picker {
        flex-grow: 1;
        margin-right: 8px;
      }
      .entity-row ha-icon-button {
        flex-shrink: 0;
      }
      .section-header {
        margin-top: 24px;
        margin-bottom: 16px;
        color: var(--secondary-text-color);
        font-weight: 500;
        font-size: 16px;
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 5px;
      }
      ha-formfield {
        display: block;
        padding: 8px 0;
      }
      .background-image-row {
        margin-top: 8px;
        width: 100%;
      }
      .background-image-row ha-textfield {
        width: 100%;
      }
      .background-help-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        margin-bottom: 16px;
      }
      .conditional-field {
        padding-left: 16px;
        margin-top: 0;
        border-left: 1px solid var(--divider-color);
        width: calc(100% - 16px);
      }
      .add-entity-button {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        margin-bottom: 24px;
      }
      .add-todo-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: var(--primary-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
      }
      .add-todo-button:hover {
        background-color: var(--secondary-background-color);
      }
      .info-panel {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        margin: 8px 0 24px 0;
        background-color: var(--primary-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }
      .info-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: var(--info-color, #4a90e2);
        color: white;
        margin-right: 12px;
        flex-shrink: 0;
      }
      .info-text {
        flex-grow: 1;
        color: var(--primary-text-color);
        font-size: 14px;
      }
      .version-display {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .version-text {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 500;
      }
      .version-badge {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border-radius: 16px;
        padding: 4px 12px;
        font-size: 14px;
        font-weight: 500;
        margin-left: auto;
      }
      .spacing-field {
        margin-top: 16px;
        margin-bottom: 16px;
        width: 100%;
      }
      .spacing-field ha-textfield {
        width: 100%;
        display: block;
      }
      .spacing-help-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        margin-bottom: 16px;
      }
      .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
        width: 100%;
      }
      .toggle-option-label {
        font-size: 14px;
      }
      .version-info {
        font-size: 12px;
        color: var(--primary-color);
        margin-top: 4px;
      }
      .todo-lists-container, 
      .display-options-container, 
      .background-images-container,
      .custom-card-mod-container {
        width: 100%;
      }
      
      .nested-toggle-option {
        margin-left: 16px;
        padding-left: 8px;
        border-left: 1px solid var(--divider-color);
      }
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    const value = target.checked !== undefined ? target.checked : target.value;
    const configValue = target.configValue || target.getAttribute('data-config-value');
    
    if (configValue) {
      // Create a new config object with the updated value
      const newConfig = { ...this._config, [configValue]: value };
      this._config = newConfig; // Update internal state first
      
      // Use debounce to avoid excessive reflows for rapid changes
      this._debounceDispatch(newConfig);
    }
  }

  // Debounce config change dispatches for better performance
  _debounceDispatch(newConfig) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
    
    this._debounceTimeout = setTimeout(() => {
      debugLog(`Dispatching config-changed event`, newConfig);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
      this._debounceTimeout = null;
    }, 300); // Increased debounce time
  }

  _cardSpacingChanged(ev) {
    if (!this._config) return;
    
    const value = parseInt(ev.target.value);
    if (!isNaN(value) && value >= 0) {
      const newConfig = { ...this._config, card_spacing: value };
      this._config = newConfig; // Update internal state first
      
      debugLog(`Card spacing changed to: ${value}`, newConfig);
      this._debounceDispatch(newConfig);
    }
  }

  _addEntity(e) {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!this._config) return;
    
    // Create a deep copy of the current config to avoid reference issues
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure entities is an array
    if (!Array.isArray(newConfig.entities)) {
      newConfig.entities = newConfig.entities ? [newConfig.entities] : [];
    }
    
    // Add a new empty entity
    newConfig.entities.push("");
    
    // Update internal state first
    this._config = newConfig;
    
    // Request an update to ensure the UI reflects the change
    this.requestUpdate();
    
    // Dispatch the event
    debugLog("Adding new entity", newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
  }

  _removeEntity(index) {
    if (!this._config || !Array.isArray(this._config.entities)) return;
    
    // Create deep copies of arrays/objects to ensure change detection
    const entities = [...this._config.entities];
    const backgroundImages = {...this._config.background_images};
    
    // Get the entity being removed
    const removedEntityId = entities[index];
    
    // Remove the entity
    entities.splice(index, 1);
    
    // Also remove associated background image if it exists
    if (removedEntityId && backgroundImages[removedEntityId]) {
        delete backgroundImages[removedEntityId];
    }

    // Create a new config with the updated arrays
    const newConfig = { 
        ...this._config, 
        entities, 
        background_images: backgroundImages 
    };
    
    // Update internal state first
    this._config = newConfig;
    
    // Dispatch the event with the new config
    debugLog(`Removing entity at index ${index}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    
    // Force UI update
    this.requestUpdate();
  }

  _entityChanged(ev) {
    // Safely handle the case where index might be null/undefined
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const newValue = ev.detail?.value || ev.target.value || "";
    const oldValue = this._config.entities[index]; // Get the old value
    
    // Check if the value actually changed
    if (newValue === oldValue) return;
    
    // Create deep copies to ensure change detection
    const entities = [...this._config.entities];
    const backgroundImages = {...this._config.background_images};
    
    // Update the entity
    entities[index] = newValue;

    // Update background image key if entity changed
    if (oldValue && backgroundImages[oldValue]) {
        if (newValue) { // If new value is not empty, transfer the background
            backgroundImages[newValue] = backgroundImages[oldValue];
        }
        delete backgroundImages[oldValue]; // Remove the old key entry
    }

    // Create a new config with the updates
    const newConfig = { 
        ...this._config, 
        entities, 
        background_images: backgroundImages 
    };
    
    // Update internal state first
    this._config = newConfig;
    
    // Dispatch the event
    debugLog(`Entity at index ${index} changed from "${oldValue}" to "${newValue}"`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    
    // Force UI update
    this.requestUpdate();
  }

  _backgroundImageChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const imageUrl = ev.target.value || "";
    
    // Create a new background_images object
    const backgroundImages = { ...this._config.background_images };

    // Update or remove the image URL
    if (imageUrl) {
      backgroundImages[entityId] = imageUrl;
    } else {
      delete backgroundImages[entityId];
    }

    // Create new config with updated background_images
    const newConfig = { ...this._config, background_images: backgroundImages };
    
    // Update internal state first
    this._config = newConfig;
    
    // Use debounced dispatch for background image changes
    this._debounceDispatch(newConfig);
  }

  render() {
    if (!this.hass || !this._config) {
      return html`<div>Loading...</div>`;
    }

    // Make sure we have an entities array
    const entities = Array.isArray(this._config.entities) ? this._config.entities : [];
    
    debugLog("Rendering editor with config:", JSON.stringify(this._config));
    debugLog("Current entities:", entities);

    return html`
      <div class="card-config">
        <div class="info-panel">
          <div class="info-icon">i</div>
          <div class="info-text">
            When adding (additional) to-do lists, you may need to click the "+" button twice. 
            The first click updates the configuration, and the second click shows the entity picker.
          </div>
        </div>

        <!-- Todo Lists Section -->
        <div class="todo-lists-container">
          <div class="section-header">Todo Lists</div>
          ${entities.map((entity, index) => html`
            <div class="entity-row">
              <ha-entity-picker
                .hass=${this.hass}
                .value=${entity}
                .includeDomains=${['todo']}
                data-index=${index}
                @value-changed=${this._entityChanged}
                allow-custom-entity
              ></ha-entity-picker>
              <ha-icon-button
                .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                @click=${() => this._removeEntity(index)}
                title="Remove this list"
              ></ha-icon-button>
            </div>
          `)}
          <div class="add-entity-button">
            <button class="add-todo-button" @click=${this._addEntity}>
              <svg style="width:20px;height:20px;margin-right:8px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              ADD TODO LIST
            </button>
          </div>
        </div>

        <!-- Display Options Section -->
        <div class="display-options-container">
          <div class="section-header">Display Options</div>

          <!-- Card spacing -->
          <div class="spacing-field">
            <ha-textfield
              type="number"
              min="0"
              max="100"
              label="Card Spacing (px)"
              .value=${this._card_spacing}
              @change=${this._cardSpacingChanged}
              data-config-value="card_spacing"
              suffix="px"
            ></ha-textfield>
            <div class="spacing-help-text">
              Visual gap between cards when swiping (in pixels)
            </div>
          </div>

          <!-- Toggle options -->
          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this._show_pagination}
              data-config-value="show_pagination"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show 'Add item' field</div>
            <ha-switch
              .checked=${this._show_create}
              data-config-value="show_create"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <!-- Conditional Add Button option nested under Show create field -->
          ${this._show_create ? html`
            <div class="nested-toggle-option">
              <div class="toggle-option">
                <div class="toggle-option-label">Show '+' add button next to field</div>
                <ha-switch
                  .checked=${this._show_addbutton}
                  data-config-value="show_addbutton"
                  @change=${this._valueChanged}
                ></ha-switch>
              </div>
            </div>
          ` : ''}

          <!-- Show completed items -->
          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this._show_completed}
              data-config-value="show_completed"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <!-- Conditional Completed Menu option -->
          ${this._show_completed ? html`
            <div class="nested-toggle-option">
              <div class="toggle-option">
                <div class="toggle-option-label">Show 'Delete completed' button</div>
                <ha-switch
                  .checked=${this._show_completed_menu}
                  data-config-value="show_completed_menu"
                  @change=${this._valueChanged}
                ></ha-switch>
              </div>
              
              <!-- Delete confirmation option (only visible when delete button is shown) -->
              ${this._show_completed_menu ? html`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show delete confirmation dialog</div>
                    <ha-switch
                      .checked=${this._delete_confirmation}
                      data-config-value="delete_confirmation"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Background images -->
        ${this._showBackgroundImagesSection ? html`
          <div class="background-images-container">
            <div class="section-header">Background Images</div>
            <div class="background-help-text">
              Optional. Enter the path to an image (e.g., /local/images/bg.jpg).
            </div>
            ${this._validEntities.map(entityId => {
              // Get the display name with proper capitalization
              const entityName = this.hass.states[entityId]?.attributes?.friendly_name ||
                                entityId.split('.').pop().replace(/_/g, ' ');
              return html`
                <div class="background-image-row">
                  <ha-textfield
                    label="${entityName}"
                    .value=${this._config.background_images && this._config.background_images[entityId] || ""}
                    data-entity=${entityId}
                    @input=${this._backgroundImageChanged}
                  ></ha-textfield>
                </div>
              `;
            })}
          </div>
        ` : ''}

        <!-- Version display -->
        <div class="version-display">
          <div class="version-text">Todo Swipe Card</div>
          <div class="version-badge">v1.6.0</div>
        </div>
      </div>
    `;
  }
}

// Define custom elements
customElements.define('todo-swipe-card', TodoSwipeCard);
customElements.define('todo-swipe-card-editor', TodoSwipeCardEditor);

// Add card to UI picker
if (!window.customCards) {
  window.customCards = [];
}

// Ensure registration happens only once
let registered = window.customCards.some(card => card.type === "todo-swipe-card");
if (!registered) {
  window.customCards.push({
    type: "todo-swipe-card",
    name: "Todo Swipe Card",
    preview: true, // Enable preview
    description: "A specialized swipe card for to-do lists with built-in styling (requires card-mod)",
  });
  debugLog("Todo Swipe Card registered in customCards");
}

// Version logging
console.info(
  `%c TODO-SWIPE-CARD %c v1.7.3 %c - A swipeable card for to-do lists`,
  "color: white; background: #4caf50; font-weight: 700;",
  "color: #4caf50; background: white; font-weight: 700;",
  "color: grey; background: white; font-weight: 400;"
);
