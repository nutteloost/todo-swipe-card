/**
 * Todo Swipe Card - Fixed WebSocket Overflow Version
 * 
 * A specialized swipe card for todo lists in Home Assistant
 * Allows users to swipe between multiple todo lists with customized styling
 * 
 * Requires card-mod to be installed: https://github.com/thomasloven/lovelace-card-mod
 * 
 * @author nutteloost
 * @version ${VERSION}
 * @license MIT
 * @see {@link https://github.com/nutteloost/todo-swipe-card}
 */


import { LitElement, html, css } from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

// Version number
const VERSION = '2.0.0';

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
    this.cards = [];
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    this.initialized = false;
    this._menuObservers = [];
    this._dynamicStyleElement = null;
    this._configUpdateTimer = null;
    this._buildPromise = null;
    this._cardHelpers = null;
    this._lastConfig = null;
    this._updateThrottle = null;
    this._lastHassUpdate = null;
    this._menuObserverTimeout = null;
  }

  /**
   * Returns default configuration for the card
   * @returns {Object} Default configuration
   */
  static getStubConfig() {
    return {
      entities: [],
      card_spacing: 15,
      show_pagination: true,
      show_create: true,
      show_addbutton: false,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false
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
           this._config.entities.some(entity => {
             if (typeof entity === 'string') {
               return entity && entity.trim() !== "";
             }
             return entity && entity.entity && entity.entity.trim() !== "";
           });
  }

  /**
   * Detect legacy configuration format
   * @param {Object} config - Configuration to check
   * @returns {Object} Detection result with isLegacy flag and found properties
   * @private
   */
  _detectLegacyConfig(config) {
    const legacyProperties = [
      'background_images',
      'display_orders', 
      'entity_titles',
      'show_titles'
    ];
    
    const foundLegacyProps = legacyProperties.filter(prop => 
      config.hasOwnProperty(prop) && config[prop] && Object.keys(config[prop]).length > 0
    );
    
    return {
      isLegacy: foundLegacyProps.length > 0,
      legacyProperties: foundLegacyProps
    };
  }

  /**
   * Migrate legacy config to new entity-centric format
   * @param {Object} oldConfig - Legacy configuration
   * @returns {Object} Migrated configuration
   * @private
   */
  _migrateLegacyConfig(oldConfig) {
    // Convert entities to new format
    let migratedEntities = [];
    if (oldConfig.entities && Array.isArray(oldConfig.entities)) {
      migratedEntities = oldConfig.entities.map(entity => {
        if (typeof entity === 'string') {
          const entityConfig = { entity };
          
          // Migrate background image
          if (oldConfig.background_images && oldConfig.background_images[entity]) {
            entityConfig.background_image = oldConfig.background_images[entity];
          }
          
          // Migrate display order
          if (oldConfig.display_orders && oldConfig.display_orders[entity]) {
            entityConfig.display_order = oldConfig.display_orders[entity];
          }
          
          // Migrate show title
          if (oldConfig.show_titles && oldConfig.show_titles[entity]) {
            entityConfig.show_title = oldConfig.show_titles[entity];
          }
          
          // Migrate entity title
          if (oldConfig.entity_titles && oldConfig.entity_titles[entity]) {
            entityConfig.title = oldConfig.entity_titles[entity];
          }
          
          return entityConfig;
        }
        return entity; // Already in new format
      });
    }
    
    // Start with all properties from old config
    const newConfig = { ...oldConfig };
    
    // Remove legacy properties
    delete newConfig.background_images;
    delete newConfig.display_orders;
    delete newConfig.entity_titles;
    delete newConfig.show_titles;
    delete newConfig.custom_card_mod;
    
    // Update entities with migrated format
    newConfig.entities = migratedEntities;
    
    // Rebuild config in desired order with type first, preserving all other properties
    const orderedConfig = {
      type: newConfig.type,
      entities: newConfig.entities,
      ...Object.fromEntries(
        Object.entries(newConfig).filter(([key]) => key !== 'type' && key !== 'entities')
      )
    };
    
    return orderedConfig;
  }

  /**
   * Get entity ID from entity configuration (handles both string and object formats)
   * @param {string|Object} entity - Entity configuration
   * @returns {string} Entity ID
   * @private
   */
  _getEntityId(entity) {
    if (typeof entity === 'string') {
      return entity;
    }
    return entity?.entity || '';
  }

  /**
   * Get all entity IDs from current configuration
   * @returns {Array<string>} Array of entity IDs
   * @private
   */
  _getAllEntityIds() {
    if (!this._config?.entities) return [];
    return this._config.entities
      .map(entity => this._getEntityId(entity))
      .filter(entityId => entityId && entityId.trim() !== "");
  }

  /**
   * Get entity configuration by ID
   * @param {string} entityId - Entity ID to find
   * @returns {Object|null} Entity configuration object or null if not found
   * @private
   */
  _getEntityConfig(entityId) {
    if (!this._config?.entities) return null;
    
    const entity = this._config.entities.find(entity => 
      this._getEntityId(entity) === entityId
    );
    
    if (typeof entity === 'string') {
      return { entity: entityId };
    }
    
    return entity || null;
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
    
    // Skip if the hass objects are the same reference (no actual change)
    if (this._hass === hass) return false;
    
    // Add a timestamp-based throttle to prevent rapid successive updates
    const now = Date.now();
    if (this._lastHassUpdate && (now - this._lastHassUpdate) < 250) {
      return false;
    }
    this._lastHassUpdate = now;
    
    // Check if any of our monitored entities have changed
    const entityIds = this._getAllEntityIds();
    let hasRelevantChanges = false;
    
    for (const entityId of entityIds) {
      if (!entityId || entityId.trim() === "") continue;
      
      const oldState = this._hass.states[entityId];
      const newState = hass.states[entityId];
      
      // Check if the entity state or attributes have changed significantly
      if (!oldState || !newState) {
        hasRelevantChanges = true;
        break;
      }
      
      // Only update for meaningful changes, not just timestamp updates
      if (oldState.state !== newState.state) {
        hasRelevantChanges = true;
        break;
      }
      
      // Check for changes in todo items specifically
      const oldItems = oldState.attributes?.items || [];
      const newItems = newState.attributes?.items || [];
      
      // Compare item count first (quick check)
      if (oldItems.length !== newItems.length) {
        hasRelevantChanges = true;
        break;
      }
      
      // Deep compare items (but limit to prevent excessive processing)
      if (oldItems.length > 0 && oldItems.length < 100) { // Limit to prevent performance issues
        const oldItemsStr = JSON.stringify(oldItems);
        const newItemsStr = JSON.stringify(newItems);
        if (oldItemsStr !== newItemsStr) {
          hasRelevantChanges = true;
          break;
        }
      }
    }
    
    return hasRelevantChanges;
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
    // If no custom style provided, return internal style
    if (!customStyle || Object.keys(customStyle).length === 0) {
      return internalStyle;
    }
    
    // Simple merge without caching for better performance
    const mergedStyle = { ...internalStyle };
    
    for (const selector in customStyle) {
      if (selector in mergedStyle) {
        if (typeof customStyle[selector] === 'string' && typeof mergedStyle[selector] === 'string') {
          mergedStyle[selector] = mergedStyle[selector] + '\n' + customStyle[selector];
        } else {
          mergedStyle[selector] = { ...mergedStyle[selector], ...customStyle[selector] };
        }
      } else {
        mergedStyle[selector] = customStyle[selector];
      }
    }
    
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
   * Get the actual todo-list card element from a potentially wrapped element
   * @param {HTMLElement} element - The element (might be wrapped)
   * @returns {HTMLElement} The actual todo-list card element
   * @private
   */
  _getActualCardElement(element) {
    // If it's a wrapper, find the card inside
    if (element && element.classList && element.classList.contains('todo-card-with-title-wrapper')) {
      // The card is inside the second child (cardContainer) of the wrapper
      const cardContainer = element.children[1]; // First child is title, second is card container
      if (cardContainer && cardContainer.firstElementChild) {
        return cardContainer.firstElementChild; // This is the actual card element
      }
    }
    return element;
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
    
    // Normalize entities to support both string and object formats
    entities = entities.map(entity => {
      if (typeof entity === 'string') {
        // Convert string to object format, but keep it as string if empty
        return entity.trim() === "" ? entity : { entity: entity };
      }
      return entity; // Already object format
    }).filter(entity => {
      if (typeof entity === 'string') {
        return entity !== ""; // Keep non-empty strings
      }
      return entity && (entity.entity || entity.entity === ""); // Keep objects with entity property
    });

    // Set defaults and merge config
    const newConfig = {
      ...TodoSwipeCard.getStubConfig(),
      ...config,
      entities // Override with our normalized entities array
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
        // Debounce rebuild to prevent excessive DOM manipulation
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
    const paginationChanged = oldConfig.show_pagination !== newConfig.show_pagination;
    const createFieldChanged = oldConfig.show_create !== newConfig.show_create;
    const cardModChanged = JSON.stringify(oldConfig.card_mod) !== JSON.stringify(newConfig.card_mod);
  
    return entitiesChanged || paginationChanged || createFieldChanged || cardModChanged;
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
        // Use the stored entity config from the card object first, then fallback to lookup
        const entityConfig = card.entityConfig || this._getEntityConfig(card.entityId);
        const deleteButton = this._createDeleteButton(card.entityId, entityConfig);
        slide.appendChild(deleteButton);
      }
    });
  }

  /**
   * Create a delete button element
   * @param {string} entityId - Entity ID for the todo list
   * @param {Object} entityConfig - Entity configuration object
   * @returns {HTMLElement} Delete button element
   * @private
   */
  _createDeleteButton(entityId, entityConfig = null) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-completed-button';
    deleteButton.title = 'Delete completed items';
    deleteButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
      </svg>
    `;
    
    // Auto-adjust position if entity has a title
    if (entityConfig && entityConfig.show_title && entityConfig.title) {
      // Calculate auto-adjusted position: default 35px + title height (default 40px)
      const basePosition = 35;
      const titleHeight = 'var(--todo-swipe-card-title-height, 40px)';
      const autoAdjustedTop = `calc(${basePosition}px + ${titleHeight})`;
      
      // Set the auto-adjustment CSS variable on the button
      deleteButton.style.setProperty('--todo-swipe-card-delete-button-auto-top', autoAdjustedTop);
    }
    
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
   * Set the hass object and update all child cards
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
    
    // Throttle hass updates to prevent excessive re-renders
    this._updateThrottle = setTimeout(() => {
      // More strict check for entity changes
      if (this._shouldUpdateChildCards(hass)) {
        debugLog("Updating child cards due to entity changes");
        
        // Update child cards in a batch with additional safety checks
        requestAnimationFrame(() => {
          // Double-check cards still exist after RAF
          if (!this.cards || !this._hass) return;
          
          this.cards.forEach((card, index) => {
            if (card && card.element) {
              try {
                // Get the actual card element (might be wrapped)
                const actualCard = this._getActualCardElement(card.element);
                
                // Only update if the card element exists, is connected, and hass actually changed
                if (actualCard && actualCard.isConnected && actualCard.hass !== hass) {
                  actualCard.hass = hass;
                }
              } catch (e) {
                console.error("Error setting hass on child card:", e);
              }
            }
          });
        });
      }
      
      this._updateThrottle = null;
    }, 500);
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
   * Improved cleanup for better memory management and to prevent WebSocket flooding
   */
  disconnectedCallback() {
    debugLog("TodoSwipeCard disconnecting - performing cleanup");
    
    // Clear all timers first to prevent any pending operations
    if (this._configUpdateTimer) {
      clearTimeout(this._configUpdateTimer);
      this._configUpdateTimer = null;
    }
    
    if (this._updateThrottle) {
      clearTimeout(this._updateThrottle);
      this._updateThrottle = null;
    }
    
    if (this._menuObserverTimeout) {
      clearTimeout(this._menuObserverTimeout);
      this._menuObserverTimeout = null;
    }
    
    // Clear resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Clear menu observers with safety check
    if (this._menuObservers) {
      this._menuObservers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (e) {
          console.warn("Error disconnecting menu observer:", e);
        }
      });
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
    
    // Disconnect child cards from hass to prevent further updates
    if (this.cards) {
      this.cards.forEach(card => {
        if (card?.element) {
          try {
            const actualCard = this._getActualCardElement(card.element);
            if (actualCard) {
              // Set hass to null to stop further updates
              actualCard.hass = null;
            }
          } catch (e) {
            console.warn("Error disconnecting child card:", e);
          }
        }
      });
    }
    
    // Mark as not initialized but keep critical references
    this.initialized = false;
    
    // Clear DOM references
    this.cards = [];
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    
    // Reset update tracking
    this._lastHassUpdate = null;
    
    // Only clear shadowRoot content if it exists
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }
    
    debugLog("TodoSwipeCard cleanup completed");
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
        opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);
        cursor: pointer;
        transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
        flex-shrink: 0;
      }

      .pagination-dot.active {
        background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
        width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
        height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
        opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);
      }
      
      .delete-completed-button {
        position: absolute;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));
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
    let currentIndex = 0;
    for (const batch of entityBatches) {
      const batchStartIndex = currentIndex;
      await Promise.all(batch.map(async (entityConfig, batchIndex) => {
        const i = batchStartIndex + batchIndex;
        const entityId = this._getEntityId(entityConfig);
        
        if (!entityId || entityId.trim() === "") {
          debugLog("Skipping empty entity at index", i);
          return null;
        }

        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';

        try {
          // Create card element
          const cardElement = await this._createSingleTodoCard(helpers, entityConfig);
          
          // Pass hass immediately if available
          if (this._hass) {
            const actualCard = this._getActualCardElement(cardElement);
            if (actualCard) {
              actualCard.hass = this._hass;
            }
          }
          
          // Store reference to the card
          this.cards[i] = {
            element: cardElement,
            slide: slideDiv,
            entityId: entityId,
            entityConfig: entityConfig
          };
          
          // Add card to slide
          slideDiv.appendChild(cardElement);
          
          // Add custom delete button if configured
          if (this._config.show_completed && this._config.show_completed_menu) {
            const deleteButton = this._createDeleteButton(entityId, entityConfig);
            slideDiv.appendChild(deleteButton);
          }
          
          this.sliderElement.appendChild(slideDiv);
          
          // Process menus after a slight delay to ensure DOM is ready
          setTimeout(() => {
            const actualCard = this._getActualCardElement(cardElement);
            if (actualCard && actualCard.shadowRoot) {
              this._hideMenusInRoot(actualCard.shadowRoot);
            }
          }, 50);
          
          // Setup input field enhancements
          this._enhanceInputField(this._getActualCardElement(cardElement));
          
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
      currentIndex += batch.length;
    }
    
    // Filter out any potential gaps if errors occurred
    this.cards = this.cards.filter(Boolean);
  }

  /**
   * Create a single todo card
   * @param {Object} helpers - Card helpers
   * @param {string|Object} entityConfig - Entity configuration (string or object)
   * @returns {Promise<HTMLElement>} Card element
   * @private
   */
  async _createSingleTodoCard(helpers, entityConfig) {
    const entityId = this._getEntityId(entityConfig);
    debugLog("Creating card for entity:", entityId);
    
    // Generate internal styles for this card
    const internalStyles = this._generateInternalStyles(entityConfig);
    
    // Get custom card mod styling from config
    const customCardModStyle = this._config.card_mod || this._config.custom_card_mod || {};
    
    // Merge internal and custom styling using the optimized method
    const mergedCardModStyle = this._mergeCardModStyles(internalStyles, customCardModStyle);
    
    // Get display order for this entity
    const displayOrder = (typeof entityConfig === 'object' && entityConfig.display_order) || 'none';
    
    // Create the todo-list card with merged card-mod styling and display order
    const cardConfig = {
      type: 'todo-list',
      entity: entityId,
      hide_create: !this._config.show_create,
      hide_completed: !this._config.show_completed,
      display_order: displayOrder,
      card_mod: {
        style: mergedCardModStyle
      }
    };
    
    const cardElement = await helpers.createCardElement(cardConfig);

    // Check if title should be shown
    const showTitle = (typeof entityConfig === 'object' && entityConfig.show_title) || false;
    const titleText = (typeof entityConfig === 'object' && entityConfig.title) || '';
    
    let finalElement = cardElement;
    
    // If title is enabled and has text, create wrapper
    if (showTitle && titleText) {
      finalElement = this._createCardWithTitle(cardElement, titleText);
    }
    
    return finalElement;
  }

  /**
   * Create a wrapper around the card with title
   * This replaces the old _addTitleToCard method
   * @param {HTMLElement} cardElement - The card element
   * @param {string} titleText - The title text
   * @returns {HTMLElement} Wrapper element containing title and card
   * @private
   */
  _createCardWithTitle(cardElement, titleText) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'todo-card-with-title-wrapper';
    wrapper.style.cssText = `
      position: relative;
      height: 100%;
      width: 100%;
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, white));
      display: flex;
      flex-direction: column;
    `;
    
    // Create title
    const titleElement = document.createElement('div');
    titleElement.className = 'todo-swipe-card-external-title';
    titleElement.textContent = titleText;
    titleElement.style.cssText = `
      height: var(--todo-swipe-card-title-height, 40px);
      display: flex;
      align-items: center;
      justify-content: var(--todo-swipe-card-title-justify, center);
      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));
      color: var(--todo-swipe-card-title-color, var(--primary-text-color));
      font-size: var(--todo-swipe-card-title-font-size, 16px);
      font-weight: var(--todo-swipe-card-title-font-weight, 500);
      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));
      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);
      box-sizing: border-box;
      text-align: var(--todo-swipe-card-title-text-align, center);
      flex-shrink: 0;
      z-index: 1;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      margin: 0;
      line-height: 1;
      font-family: inherit;
      white-space: var(--todo-swipe-card-title-white-space, nowrap);
      overflow: var(--todo-swipe-card-title-overflow, hidden);
      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);
    `;
    
    // Create card container
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
      flex: 1;
      min-height: 0;
      overflow: auto;
      position: relative;
    `;
    
    // Ensure the card takes full height and remove top border radius
    cardElement.style.height = '100%';
    cardElement.style.minHeight = '0';
    cardElement.style.borderRadius = '0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px)';
    cardElement.style.borderTopLeftRadius = '0';
    cardElement.style.borderTopRightRadius = '0';

    // Also target the ha-card inside if it exists
    setTimeout(() => {
      const haCard = cardElement.shadowRoot?.querySelector('ha-card');
      if (haCard) {
        haCard.style.borderRadius = '0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px)';
        haCard.style.borderTopLeftRadius = '0';
        haCard.style.borderTopRightRadius = '0';
      }
    }, 0);
    
    // Assemble
    wrapper.appendChild(titleElement);
    cardContainer.appendChild(cardElement);
    wrapper.appendChild(cardContainer);
    
    return wrapper;
  }

  /**
   * Generate internal styles for a todo card
   * Updated to include automatic due date icon scaling and new CSS variable names
   * @param {string|Object} entityConfig - Entity configuration (string or object)
   * @returns {Object} Internal card mod styles
   * @private
   */
  _generateInternalStyles(entityConfig) {
    const entityId = this._getEntityId(entityConfig);
    
    // Get background image if configured
    let backgroundImage = null;
    if (typeof entityConfig === 'object' && entityConfig.background_image) {
      backgroundImage = entityConfig.background_image;
    }
    
    // Determine if Add button should be shown
    const showAddButton = this._config.show_addbutton !== undefined ? 
                          this._config.show_addbutton : false;
    
    // Use CSS variables for all colors with proper fallbacks
    let textColor = `var(--todo-swipe-card-text-color, var(--primary-text-color))`;
    let checkboxColor = `var(--todo-swipe-card-checkbox-color, rgba(255, 255, 255, 0.5))`;
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
            max-width: calc(100% - 13px) !important;
            padding-right: 10px !important;
            margin-left: -4px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;
          }
          
          /* Text field container adjustment */
          .mdc-text-field {
            --mdc-text-field-fill-color: transparent;
            height: auto !important;
            --text-field-padding: 0px 13px 5px 5px;
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
          --mdc-typography-subtitle1-font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));
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
        ha-check-list-item,
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

        ha-checkbox {
          --mdc-checkbox-unchecked-color: ${checkboxColor} !important;
          --mdc-checkbox-checked-color: ${checkboxCheckedColor} !important;
          --mdc-checkbox-selected-checkmark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-mark-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-ink-color: ${checkboxCheckmarkColor} !important;
          --mdc-checkbox-disabled-color: rgba(0, 0, 0, 0.38) !important;
        }

        /* Direct SVG path targeting for checkmark - keep at full opacity */
        ha-checkbox svg path,
        ha-checkbox .mdc-checkbox__checkmark-path {
          stroke: ${checkboxCheckmarkColor} !important;
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

        /* Hide all headers and menus and fix margin inconsistency */
        ha-card.type-todo-list div.header h2,
        ha-card.type-todo-list div.header ha-button-menu,
        ha-button-menu {
          display: none !important;
        }

        /* Fix header margin inconsistency across all cards */
        ha-card.type-todo-list div.header {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
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

        /* List item base styling */
        ha-check-list-item {
          min-height: var(--todo-swipe-card-item-height, 0px) !important;
          --mdc-list-item-graphic-margin: var(--todo-swipe-card-item-margin, 5px) !important;
          color: ${textColor} !important;
          padding-right: 40px !important;
          align-items: flex-start !important;
          margin-top: var(--todo-swipe-card-item-spacing, 0px) !important;
        }

        /* Remove margin from first item - more specific selector */
        ha-card.type-todo-list ha-check-list-item:first-child,
        ha-check-list-item:first-of-type {
          margin-top: 0 !important;
        }

        /* Enable text wrapping for text content containers */
        ha-check-list-item .mdc-list-item__text {
          max-width: calc(100% - 70px) !important;
          overflow: visible !important;
          text-overflow: clip !important;
          white-space: normal !important;
          color: ${textColor} !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }

        /* Ensure primary text wraps properly */
        ha-check-list-item .mdc-list-item__primary-text {
          max-width: calc(100% - 70px) !important;
          overflow: visible !important;
          text-overflow: clip !important;
          white-space: normal !important;
          color: ${textColor} !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }

        /* Apply text wrapping at the item level to override Material Design defaults */
        ha-check-list-item span,
        ha-check-list-item .mdc-deprecated-list-item__text,
        ha-check-list-item .mdc-deprecated-list-item__primary-text {
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }

        /* Ensure checkbox graphic stays at top when text wraps */
        ha-check-list-item .mdc-list-item__graphic {
          align-self: flex-start !important;
          margin-top: 2px !important;
        }

        /* Special handling for multiline items (with due dates) */
        ha-check-list-item.multiline {
          align-items: flex-start !important;
          --check-list-item-graphic-margin-top: 0px !important; 
        }

        ha-check-list-item.multiline .mdc-list-item__text {
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: clip !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }
        
        /* Target the .column div (which contains summary and due date) inside a multiline item */
        ha-check-list-item.multiline .column {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        /* Allow text within the summary and due date lines themselves to wrap if it's very long */
        ha-check-list-item.multiline .summary,
        ha-check-list-item.multiline .due {
          white-space: normal !important;
        }

        /* Description styling with customizable color */
        .description,
        ha-markdown-element.description,
        ha-check-list-item .description,
        ha-check-list-item ha-markdown-element.description {
          color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color)) !important;
          font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)) !important;
          margin-top: var(--todo-swipe-card-description-margin-top, 2px) !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }

        /* Due date styling with customizable colors and font size */
        .due,
        ha-check-list-item .due,
        ha-check-list-item.multiline .due {
          color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color)) !important;
          font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)))) !important;
          margin-top: var(--todo-swipe-card-due-date-margin-top, 4px) !important;
          line-height: var(--todo-swipe-card-line-height, 1.4) !important;
        }

        /* Overdue due date styling with customizable color */
        .due.overdue,
        ha-check-list-item .due.overdue,
        ha-check-list-item.multiline .due.overdue {
          color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color)) !important;
        }

        /* Completed items with overdue dates revert to normal due date color */
        ha-check-list-item.completed .due.overdue {
          color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color)) !important;
        }

        /* Apply custom font size to secondary text (where due date appears) with new variable names and backward compatibility */
        ha-check-list-item .mdc-list-item__secondary-text,
        ha-check-list-item .mdc-deprecated-list-item__secondary-text {
          font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)))) !important;
        }

        /* Due date icon scaling - automatically matches text size with new variable names and backward compatibility */
        .due ha-svg-icon,
        ha-check-list-item .due ha-svg-icon,
        ha-check-list-item.multiline .due ha-svg-icon {
          --mdc-icon-size: calc(var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)))) * 1.2) !important;
          width: calc(var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)))) * 1.2) !important;
          height: calc(var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)))) * 1.2) !important;
          margin-right: 0 !important;
          margin-inline-end: 0 !important;
          margin-inline-start: initial !important;
        }

        /* Ensure proper alignment of due date content with icons */
        ha-check-list-item.multiline .due,
        ha-check-list-item .mdc-list-item__secondary-text,
        ha-check-list-item .mdc-deprecated-list-item__secondary-text {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }

        /* Content area constraint */
        ha-check-list-item .mdc-list-item__content {
          max-width: calc(100% - 75px) !important;
          overflow: visible !important;
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
        '--todo-swipe-card-pagination-dot-active-size-multiplier',
        '--todo-swipe-card-pagination-dot-active-opacity',
        '--todo-swipe-card-pagination-dot-inactive-opacity'
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
   * Uses a single observer with better performance and longer debouncing
   * @private
   */
  _setupMenuButtonObservers() {
    debugLog("Setting up menu button observers");
    
    // Clear any existing observers
    if (this._menuObservers) {
      this._menuObservers.forEach(observer => observer.disconnect());
      this._menuObservers = [];
    }
    
    // Single observer with increased debounce time
    const observer = new MutationObserver(() => {
      // Increased debounce from 250ms to 1000ms to prevent flooding
      if (this._menuObserverTimeout) clearTimeout(this._menuObserverTimeout);
      this._menuObserverTimeout = setTimeout(() => {
        // Only process if we're still connected and initialized
        if (!this.initialized || !this.shadowRoot) return;
        
        this.cards.forEach(card => {
          if (card?.element?.shadowRoot) {
            this._hideMenusInRoot(card.element.shadowRoot);
          }
        });
      }, 1000);
    });
    
    // Observe only necessary elements with reduced scope
    this.cards.forEach(card => {
      if (card?.element) {
        // Get the actual card element (might be wrapped)
        const actualCard = this._getActualCardElement(card.element);
        
        if (actualCard && actualCard.shadowRoot) {
          this._hideMenusInRoot(actualCard.shadowRoot);
          observer.observe(actualCard.shadowRoot, {
            childList: true,
            subtree: false, // Reduced scope - only direct children
            attributes: false, // Don't observe attribute changes
            characterData: false // Don't observe text changes
          });
        }
      }
    });
    
    this._menuObservers.push(observer);
  }

  /**
   * Hide menu buttons in a DOM tree
   * Hide menu buttons with performance optimizations
   * @param {ShadowRoot|Element} root - Root element to process
   * @param {number} depth - Current recursion depth
   * @private
   */
  _hideMenusInRoot(root, depth = 0) {
    if (!root || depth > 2) return; // Reduced depth limit from 3 to 2
    
    try {
      // Find all menu buttons in this root
      const menus = root.querySelectorAll ? root.querySelectorAll('ha-button-menu') : [];
      if (menus.length > 0) {
        // Batch style updates and only update if not already hidden
        requestAnimationFrame(() => {
          menus.forEach(menu => {
            if (menu && menu.parentNode && menu.style && menu.style.display !== 'none') {
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
      
      // Reduced recursive checking with stricter limits
      if (root.querySelectorAll && depth < 2) { // Reduced depth
        const shadowElements = root.querySelectorAll('*');
        let count = 0;
        
        for (const el of shadowElements) {
          if (count > 10) break; // Reduced limit from 20 to 10
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
   * Handle swipe gestures with touch and mouse support
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
 * Updated TodoSwipeCardEditor with compact layout similar to simple-swipe-card
 */
class TodoSwipeCardEditor extends LitElement {

  static TodoSortMode = {
    NONE: 'none',
    ALPHA_ASC: 'alpha_asc', 
    ALPHA_DESC: 'alpha_desc',
    DUEDATE_ASC: 'duedate_asc',
    DUEDATE_DESC: 'duedate_desc'
  };

  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _expandedEntities: { type: Set, state: true }, // Track which entities are expanded
      _buttonFeedbackState: { type: String, state: true }, // Track button feedback state
    };
  }

  constructor() {
    super();
    this._expandedEntities = new Set();
    this._buttonFeedbackState = 'normal'; // Can be 'normal', 'blocked', or 'success'
    this._showMigrationWarning = false; // Track migration warning visibility
    this._legacyConfig = null; // Store legacy config detection result
    
    // Bind the method to ensure proper context
    this._addEntity = this._addEntity.bind(this);
  }
  
  async connectedCallback() {
    super.connectedCallback();
    await this._ensureComponentsLoaded();
    this.requestUpdate();
  }
  
  async _ensureComponentsLoaded() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (!customElements.get("ha-entity-picker") && attempts < maxAttempts) {
      await this._loadCustomElements();
      if (!customElements.get("ha-entity-picker")) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }
    
    if (!customElements.get("ha-entity-picker")) {
      console.error("Failed to load ha-entity-picker after multiple attempts");
    }
  }

  async _loadCustomElements() {
    if (!customElements.get("ha-entity-picker")) {
      try {
        const attempts = [
          () => customElements.get("hui-entities-card")?.getConfigElement?.(),
          () => customElements.get("hui-entity-picker-card")?.getConfigElement?.(),
        ];

        for (const attempt of attempts) {
          try {
            await attempt();
            if (customElements.get("ha-entity-picker")) {
              break;
            }
          } catch (e) {
            console.debug("Entity picker load attempt failed:", e);
          }
        }
      } catch (e) {
        console.warn("Could not load ha-entity-picker", e);
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    if (changedProperties.has('_config') && this._config) {
      if (this._config.entities && this._config.entities.length > 0) {
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

  /**
   * Detect legacy configuration format in editor
   * @param {Object} config - Configuration to check
   * @returns {Object} Detection result with isLegacy flag and found properties
   * @private
   */
  _detectLegacyConfig(config) {
    const legacyProperties = [
      'background_images',
      'display_orders', 
      'entity_titles',
      'show_titles'
    ];
    
    const foundLegacyProps = legacyProperties.filter(prop => 
      config.hasOwnProperty(prop) && config[prop] && Object.keys(config[prop]).length > 0
    );
    
    return {
      isLegacy: foundLegacyProps.length > 0,
      legacyProperties: foundLegacyProps
    };
  }

  /**
   * Migrate legacy config to new entity-centric format
   * @param {Object} oldConfig - Legacy configuration
   * @returns {Object} Migrated configuration
   * @private
   */
  _migrateLegacyConfig(oldConfig) {
    // Convert entities to new format
    let migratedEntities = [];
    if (oldConfig.entities && Array.isArray(oldConfig.entities)) {
      migratedEntities = oldConfig.entities.map(entity => {
        if (typeof entity === 'string') {
          const entityConfig = { entity };
          
          // Migrate background image
          if (oldConfig.background_images && oldConfig.background_images[entity]) {
            entityConfig.background_image = oldConfig.background_images[entity];
          }
          
          // Migrate display order
          if (oldConfig.display_orders && oldConfig.display_orders[entity]) {
            entityConfig.display_order = oldConfig.display_orders[entity];
          }
          
          // Migrate show title
          if (oldConfig.show_titles && oldConfig.show_titles[entity]) {
            entityConfig.show_title = oldConfig.show_titles[entity];
          }
          
          // Migrate entity title
          if (oldConfig.entity_titles && oldConfig.entity_titles[entity]) {
            entityConfig.title = oldConfig.entity_titles[entity];
          }
          
          return entityConfig;
        }
        return entity; // Already in new format
      });
    }
    
    // Start with all properties from old config
    const newConfig = { ...oldConfig };
    
    // Remove legacy properties
    delete newConfig.background_images;
    delete newConfig.display_orders;
    delete newConfig.entity_titles;
    delete newConfig.show_titles;
    delete newConfig.custom_card_mod;
    
    // Update entities with migrated format
    newConfig.entities = migratedEntities;
    
    // Rebuild config in desired order with type first, preserving all other properties
    const orderedConfig = {
      type: newConfig.type,
      entities: newConfig.entities,
      ...Object.fromEntries(
        Object.entries(newConfig).filter(([key]) => key !== 'type' && key !== 'entities')
      )
    };
    
    return orderedConfig;
  }

  /**
   * Handle auto-migration button click
   * @private
   */
  _handleAutoMigrate() {
    if (!this._legacyConfig || !this._legacyConfig.isLegacy) return;
    
    const migratedConfig = this._migrateLegacyConfig(this._config);
    this._config = migratedConfig;
    this._showMigrationWarning = false;
    this._legacyConfig = null;
    
    // Dispatch the migrated config
    this.dispatchEvent(new CustomEvent('config-changed', { 
      detail: { config: migratedConfig },
      bubbles: true,
      composed: true
    }));
    
    this.requestUpdate();
  }

  /**
   * Helper to get entity ID from entity configuration
   * @param {string|Object} entity - Entity configuration
   * @returns {string} Entity ID
   * @private
   */
  _getEntityId(entity) {
    if (typeof entity === 'string') {
      return entity;
    }
    return entity?.entity || '';
  }

  /**
   * Create config with proper property order
   * @param {Object} config - Configuration object
   * @returns {Object} Reordered configuration
   * @private
   */
  _createOrderedConfig(config) {
    const orderedConfig = {
      type: config.type,
      entities: config.entities,
      card_spacing: config.card_spacing,
      show_pagination: config.show_pagination,
      show_create: config.show_create,
      show_addbutton: config.show_addbutton,
      show_completed: config.show_completed,
      show_completed_menu: config.show_completed_menu,
      delete_confirmation: config.delete_confirmation,
      ...Object.fromEntries(
        Object.entries(config).filter(([key]) => ![
          'type', 'entities', 'card_spacing', 'show_pagination', 
          'show_create', 'show_addbutton', 'show_completed', 
          'show_completed_menu', 'delete_confirmation'
        ].includes(key))
      )
    };
    
    return orderedConfig;
  }

  setConfig(config) {
    debugLog("Editor setConfig called with:", JSON.stringify(config));
    
    // Detect legacy configuration
    this._legacyConfig = this._detectLegacyConfig(config);
    this._showMigrationWarning = this._legacyConfig.isLegacy;
    
    this._config = {
      ...TodoSwipeCard.getStubConfig()
    };
    
    if (config) {
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
      
      // Normalize entities to support both string and object formats
      entities = entities.map(entity => {
        if (typeof entity === 'string') {
          // Keep string format during editing for backward compatibility
          return entity;
        }
        return entity; // Already object format
      });
      
      // Only filter out empty entities if they're not at the end of the array
      // This allows newly added empty entities to persist for user configuration
      const hasTrailingEmpty = entities.length > 0 && 
        (entities[entities.length - 1] === "" || 
         (typeof entities[entities.length - 1] === 'object' && 
          entities[entities.length - 1].entity === ""));
      if (!hasTrailingEmpty) {
        entities = entities.filter(e => {
          if (typeof e === 'string') {
            return e && e.trim() !== "";
          }
          return e && e.entity && e.entity.trim() !== "";
        });
      } else {
        // Filter out empty entities except the last one
        const nonEmptyEntities = entities.slice(0, -1).filter(e => {
          if (typeof e === 'string') {
            return e && e.trim() !== "";
          }
          return e && e.entity && e.entity.trim() !== "";
        });
        entities = [...nonEmptyEntities, ""];
      }
      
      let cardSpacing = config.card_spacing;
      if (cardSpacing === undefined) {
        cardSpacing = 15;
      } else {
        cardSpacing = parseInt(cardSpacing);
        if (isNaN(cardSpacing) || cardSpacing < 0) {
          cardSpacing = 15;
        }
      }
      
      let customCardMod = config.custom_card_mod;
      if (!customCardMod || typeof customCardMod !== 'object') {
        customCardMod = {};
      }

      this._config = {
        ...this._config,
        ...config,
        entities,
        card_spacing: cardSpacing,
        custom_card_mod: customCardMod
      };
    }
    
    debugLog("TodoSwipeCardEditor - Config after initialization:", JSON.stringify(this._config));
    this.requestUpdate();
  }

  // Getters remain the same
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

  get _validEntities() {
    return (this._config.entities || []).filter(entity => {
      const entityId = this._getEntityId(entity);
      return entityId && entityId.trim() !== "";
    });
  }

  get _showBackgroundImagesSection() {
    return this._validEntities.length > 0 && this._legacyConfig && this._legacyConfig.isLegacy;
  }

  get _showCompletedMenuOption() {
    return this._show_completed;
  }
  
  get _showDeleteConfirmationOption() {
    return this._show_completed && this._show_completed_menu;
  }
  
  get _showTitleSection() {
    return this._validEntities.length > 0;
  }

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
      
      /* Card row styles similar to simple-swipe-card */
      .card-list {
        margin-top: 8px;
        margin-bottom: 16px;
      }

      .card-row {
        display: flex;
        align-items: center;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 4px);
        margin-bottom: 8px;
        background: var(--secondary-background-color);
      }

      .card-info {
        flex-grow: 1;
        display: flex;
        align-items: center;
        margin-right: 8px;
        overflow: hidden;
      }

      .card-index {
        font-weight: bold;
        margin-right: 10px; /* Back to original spacing since expand button is now separate */
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .card-type {
        font-size: 14px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-name {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-left: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-actions {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .card-actions ha-icon-button {
        --mdc-icon-button-size: 36px;
        color: var(--secondary-text-color);
      }

      .card-actions ha-icon-button:hover {
        color: var(--primary-text-color);
      }

      .no-cards {
        text-align: center;
        color: var(--secondary-text-color);
        padding: 16px;
        border: 1px dashed var(--divider-color);
        border-radius: var(--ha-card-border-radius, 4px);
        margin-bottom: 16px;
      }

      /* Updated expand button styles for left positioning */
      .expand-button {
        --mdc-icon-button-size: 32px;
        color: var(--secondary-text-color);
        margin: 0 8px 0 0; /* Right margin to separate from number */
        flex-shrink: 0;
        order: -1; /* Ensure it's always first */
        transition: color 0.2s ease, transform 0.2s ease;
      }

      .expand-button:hover {
        color: #ffc107; /* Amber color on hover */
        background-color: rgba(255, 193, 7, 0.1);
      }

      /* Visual feedback for expanded state - amber color */
      .expand-button[aria-label*="Collapse"] {
        color: #ffc107; /* Amber color when expanded */
      }

      /* Optional: Enhanced hover effect for entire row */
      .card-row:hover .expand-button {
        color: #ffc107; /* Amber color when row is hovered */
      }

      .clickable-row {
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }

      .clickable-row:hover {
        background: rgba(255, 193, 7, 0.1); /* Light amber background */
        border-color: rgba(255, 193, 7, 0.56); /* Semi-transparent amber border */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      /* Amber left border indicator on hover */
      .clickable-row:hover::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #ffc107; /* Amber left border */
        border-radius: 0 2px 2px 0;
      }

      /* Enhanced visual feedback for expanded rows - SAME amber colors */
      .clickable-row.expanded {
        border-color: rgba(255, 193, 7, 0.56); /* Same amber border as hover */
        background: rgba(255, 193, 7, 0.1); /* Same amber background as hover */
      }

      .clickable-row.expanded::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #ffc107; /* Amber left border when expanded */
        border-radius: 0 2px 2px 0;
      }

      /* Ensure buttons maintain their cursor */
      .clickable-row .card-actions {
        cursor: default; /* Reset cursor for button area */
      }

      .clickable-row .card-actions ha-icon-button {
        cursor: pointer; /* Ensure buttons still show pointer cursor */
      }

      .clickable-row:focus {
        outline: none; /* Remove default browser outline */
        border-color: rgba(255, 193, 7, 0.56); /* Same amber border as expanded */
        background: rgba(255, 193, 7, 0.1); /* Same amber background as expanded */
      }

      /* Visual hint that the row is interactive */
      .clickable-row .card-info {
        user-select: none; /* Prevent text selection on click */
      }

      /* Optional: Add a subtle animation for expand button when row is hovered */
      .clickable-row:hover .expand-button {
        color: #ffc107; /* Amber expand button on hover */
        transform: scale(1.05);
      }

      /* UPDATED: Expanded content styles with consistent width */
      .expanded-content {
        margin-top: 8px;
        margin-bottom: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 4px);
      }

      /* Ensure all form elements have consistent width */
      .expanded-content ha-entity-picker {
        width: 100% !important;
        margin-bottom: 12px !important;
        box-sizing: border-box !important;
      }

      .expanded-content ha-select {
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* Target all textfields in expanded content */
      .expanded-content ha-textfield {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      /* Make sure the toggle option container doesn't interfere */
      .expanded-content .toggle-option {
        margin: 8px 0 !important;
        padding: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* Ensure the title textfield inside toggle-option takes full width */
      .expanded-content .toggle-option ha-textfield {
        width: 100% !important;
        margin: 8px 0 0 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
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
      
      .expanded-content > div[style*="padding: 8px"] {
        padding: 8px 0 !important;
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
        transition: all 0.3s ease;
      }
      
      .add-todo-button:hover {
        background-color: var(--secondary-background-color);
      }

      .add-todo-button.blocked {
        background-color: var(--error-color);
        color: white;
        border-color: var(--error-color);
        animation: shake 0.3s ease-in-out;
      }

      .add-todo-button.success {
        background-color: var(--success-color, #4caf50);
        color: white;
        border-color: var(--success-color, #4caf50);
      }

      @keyframes shake {
        0%, 20%, 40%, 60%, 80% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-3px);
        }
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

      /* Migration warning styles */
      .migration-warning {
        margin-bottom: 16px;
        padding: 16px;
        background: var(--error-color);
        color: white;
        border-radius: var(--ha-card-border-radius, 4px);
        border: 1px solid var(--error-color);
      }

      .migration-warning-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }

      .migration-warning-icon {
        margin-right: 8px;
        font-size: 20px;
      }

      .migration-warning-text {
        margin-bottom: 12px;
        line-height: 1.4;
      }

      .migration-warning-properties {
        margin: 8px 0;
        padding: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
      }

      .migration-warning-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .migration-button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .migration-button.primary {
        background: white;
        color: var(--error-color);
      }

      .migration-button.primary:hover {
        background: #f0f0f0;
      }

      .migration-button.secondary {
        background: transparent;
        color: white;
        border: 1px solid white;
      }

      .migration-button.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    `;
  }

  // New methods for entity management
  _moveEntity(index, direction) {
    if (!this._config?.entities) return;
    const entities = [...this._config.entities];
  
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= entities.length) return;
  
    // Swap the entities (preserving their full configuration)
    [entities[index], entities[newIndex]] = [entities[newIndex], entities[index]];
  
    // Update expanded state for moved entities
    if (this._expandedEntities.has(index)) {
      this._expandedEntities.delete(index);
      this._expandedEntities.add(newIndex);
    }
    if (this._expandedEntities.has(newIndex)) {
      this._expandedEntities.delete(newIndex);
      this._expandedEntities.add(index);
    }
  
    const newConfig = { 
      ...this._config, 
      entities
    };
    
    this._config = newConfig;
    debugLog(`Moving entity at index ${index} to ${newIndex}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _toggleExpanded(index) {
    if (this._expandedEntities.has(index)) {
      // If clicking on already expanded item, collapse it
      this._expandedEntities.delete(index);
    } else {
      // Close all other expanded items first (accordion behavior)
      this._expandedEntities.clear();
      // Then expand the clicked item
      this._expandedEntities.add(index);
    }
    this.requestUpdate();
  }

  _triggerButtonFeedback(state) {
    this._buttonFeedbackState = state;
    this.requestUpdate();
    
    // Reset to normal state after a brief period
    setTimeout(() => {
      this._buttonFeedbackState = 'normal';
      this.requestUpdate();
    }, state === 'blocked' ? 1000 : 500); // Blocked state lasts longer for better visibility
  }

  _getAvailableEntities(currentIndex = -1) {
    if (!this.hass) return [];
    
    // Get all todo domain entities
    const allTodoEntities = Object.keys(this.hass.states).filter(entityId => 
      entityId.startsWith('todo.') && this.hass.states[entityId]
    );
    
    // Get currently selected entities (excluding the current index being edited)
    const selectedEntities = (this._config.entities || [])
      .map((entity, index) => {
        if (index === currentIndex) return null;
        return this._getEntityId(entity);
      })
      .filter(entityId => entityId && entityId.trim() !== "");
    
    // Return entities that are not already selected
    return allTodoEntities.filter(entityId => !selectedEntities.includes(entityId));
  }

  _getEntityDescriptor(entity) {
    const entityId = this._getEntityId(entity);
    
    if (!entityId || entityId.trim() === "") {
      return { displayName: "Empty Entity", friendlyName: "" };
    }
    
    const entityState = this.hass?.states?.[entityId];
    const friendlyName = entityState?.attributes?.friendly_name || entityId.split('.').pop().replace(/_/g, ' ');
    const displayName = friendlyName;
    
    return { displayName, friendlyName };
  }

  // Existing methods with minor updates
  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
  
    const target = ev.target;
    const value = target.checked !== undefined ? target.checked : target.value;
    const configValue = target.configValue || target.getAttribute('data-config-value');
    
    if (configValue) {
      // Maintain property order with type first
      const newConfig = this._createOrderedConfig({ ...this._config, [configValue]: value });
      this._config = newConfig;
      this._debounceDispatch(newConfig);
    }
  }

  _debounceDispatch(newConfig) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
    
    this._debounceTimeout = setTimeout(() => {
      // Ensure proper order before dispatching
      const orderedConfig = this._createOrderedConfig(newConfig);
      debugLog(`Dispatching config-changed event`, orderedConfig);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: orderedConfig } }));
    }, 150);
  }

  _cardSpacingChanged(ev) {
    if (!this._config) return;
    
    const value = parseInt(ev.target.value);
    if (!isNaN(value) && value >= 0) {
      const newConfig = this._createOrderedConfig({ ...this._config, card_spacing: value });
      this._config = newConfig;
      debugLog(`Card spacing changed to: ${value}`, newConfig);
      this._debounceDispatch(newConfig);
    }
  }

  _addEntity(e) {
    console.log("[TodoSwipeCard] _addEntity method called");
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!this._config) {
      console.log("[TodoSwipeCard] No config available");
      return;
    }
    
    // Check if there's already an empty entity at the end - prevent multiple empty entries
    const currentEntities = Array.isArray(this._config.entities) ? [...this._config.entities] : [];
    const hasTrailingEmpty = currentEntities.length > 0 && 
      (currentEntities[currentEntities.length - 1] === "" || 
       (typeof currentEntities[currentEntities.length - 1] === 'object' && 
        currentEntities[currentEntities.length - 1].entity === ""));
    
    if (hasTrailingEmpty) {
      console.log("[TodoSwipeCard] Already has trailing empty entity, skipping add");
      
      // Trigger visual feedback for blocked action
      this._triggerButtonFeedback('blocked');
      return;
    }
    
    // Add new empty entity - use object format for new entities
    currentEntities.push({ entity: "" });
    
    const newConfig = {
      ...this._config,
      entities: currentEntities
    };
    
    // Update internal state
    this._config = newConfig;
    
    debugLog("Adding new entity", newConfig);
    
    // Trigger visual feedback for successful action
    this._triggerButtonFeedback('success');
    
    // Dispatch the event immediately
    this.dispatchEvent(new CustomEvent('config-changed', { 
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    }));
    
    // Force update after a brief delay to ensure the change is processed
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
  }

  _removeEntity(index) {
    if (!this._config || !Array.isArray(this._config.entities)) return;
    
    const entities = [...this._config.entities];
    
    entities.splice(index, 1);
  
    // Update expanded state
    this._expandedEntities.delete(index);
    // Shift down expanded indices that are greater than removed index
    const newExpandedEntities = new Set();
    this._expandedEntities.forEach(expandedIndex => {
      if (expandedIndex > index) {
        newExpandedEntities.add(expandedIndex - 1);
      } else if (expandedIndex < index) {
        newExpandedEntities.add(expandedIndex);
      }
    });
    this._expandedEntities = newExpandedEntities;
  
    const newConfig = { 
      ...this._config, 
      entities
    };
    
    this._config = newConfig;
    debugLog(`Removing entity at index ${index}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _entityChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const newValue = ev.detail?.value || ev.target.value || "";
    const entities = [...this._config.entities];
    const currentEntity = entities[index];
    
    // Preserve existing entity configuration when changing entity ID
    if (typeof currentEntity === 'object') {
      entities[index] = { ...currentEntity, entity: newValue };
    } else {
      // Convert string to object format
      entities[index] = { entity: newValue };
    }

    const newConfig = { 
      ...this._config, 
      entities
    };
    
    this._config = newConfig;
    debugLog(`Entity at index ${index} changed to "${newValue}"`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _entityDisplayOrderChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const newValue = ev.target.value || 'none';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];
    
    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      entities[index] = { entity: currentEntity, display_order: newValue };
    } else {
      entities[index] = { ...currentEntity, display_order: newValue };
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityBackgroundImageChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const newValue = ev.target.value || "";
    const entities = [...this._config.entities];
    const currentEntity = entities[index];
    
    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (newValue) {
        entityConfig.background_image = newValue;
      }
      entities[index] = entityConfig;
    } else {
      if (newValue) {
        entities[index] = { ...currentEntity, background_image: newValue };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.background_image;
        entities[index] = updatedEntity;
      }
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityTitleEnabledChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const enabled = ev.target.checked;
    const entities = [...this._config.entities];
    const currentEntity = entities[index];
    
    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      entities[index] = { entity: currentEntity, show_title: enabled };
    } else {
      entities[index] = { ...currentEntity, show_title: enabled };
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityTitleTextChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const titleText = ev.target.value || "";
    const entities = [...this._config.entities];
    const currentEntity = entities[index];
    
    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (titleText) {
        entityConfig.title = titleText;
      }
      entities[index] = entityConfig;
    } else {
      if (titleText) {
        entities[index] = { ...currentEntity, title: titleText };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.title;
        entities[index] = updatedEntity;
      }
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  /**
   * Get entity configuration at index
   * @param {number} index - Entity index
   * @returns {Object} Entity configuration
   * @private
   */
  _getEntityConfigAtIndex(index) {
    const entity = this._config.entities[index];
    if (typeof entity === 'string') {
      return { entity, display_order: 'none', show_title: false, title: '', background_image: '' };
    }
    return {
      entity: entity?.entity || '',
      display_order: entity?.display_order || 'none',
      show_title: entity?.show_title || false,
      title: entity?.title || '',
      background_image: entity?.background_image || ''
    };
  }

  // Legacy support methods (for backward compatibility during migration)
  _backgroundImageChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const imageUrl = ev.target.value || "";
    const backgroundImages = { ...this._config.background_images };

    if (imageUrl) {
      backgroundImages[entityId] = imageUrl;
    } else {
      delete backgroundImages[entityId];
    }

    const newConfig = { ...this._config, background_images: backgroundImages };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _displayOrderChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const sortOrder = ev.target.value || 'none';
    const displayOrders = { ...this._config.display_orders };
    displayOrders[entityId] = sortOrder;

    const newConfig = { ...this._config, display_orders: displayOrders };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _titleEnabledChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const enabled = ev.target.checked;
    const showTitles = { ...this._config.show_titles };
    showTitles[entityId] = enabled;
  
    const newConfig = { ...this._config, show_titles: showTitles };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }
  
  _titleTextChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const titleText = ev.target.value || "";
    const entityTitles = { ...this._config.entity_titles };
    entityTitles[entityId] = titleText;
  
    const newConfig = { ...this._config, entity_titles: entityTitles };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }


  _getSortModeOptions() {
    return [
      { value: TodoSwipeCardEditor.TodoSortMode.NONE, label: 'Default' },
      { value: TodoSwipeCardEditor.TodoSortMode.ALPHA_ASC, label: 'Alphabetical A-Z' },
      { value: TodoSwipeCardEditor.TodoSortMode.ALPHA_DESC, label: 'Alphabetical Z-A' },
      { value: TodoSwipeCardEditor.TodoSortMode.DUEDATE_ASC, label: 'Due Date (Earliest First)' },
      { value: TodoSwipeCardEditor.TodoSortMode.DUEDATE_DESC, label: 'Due Date (Latest First)' }
    ];
  }

    /**
   * Handle expand button click with proper event handling
   * @param {Event} e - Click event
   * @param {number} index - Row index
   */
    _handleExpandClick(e, index) {
      e.stopPropagation(); // Prevent row click from firing
      this._toggleExpanded(index);
    }
  
    /**
     * Handle action button clicks (move up/down, delete) with proper event handling
     * @param {Event} e - Click event
     * @param {Function} action - Action to perform
     */
    _handleActionClick(e, action) {
      e.stopPropagation(); // Prevent row click from firing
      action(); // Execute the specific action (move or delete)
    }
  
    /**
     * Handle keyboard navigation for clickable rows
     * @param {KeyboardEvent} e - Keyboard event
     * @param {number} index - Row index
     */
    _handleRowKeydown(e, index) {
      // Handle Enter or Space key to toggle expansion
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        this._toggleExpanded(index);
      }
    }
  
    /**
     * Enhanced stop propagation method
     * @param {Event} e - Event to stop
     */
    _stopPropagation(e) {
      e.stopPropagation();
      e.preventDefault(); // Also prevent default to be extra safe
    }

  render() {
    if (!this.hass || !this._config) {
      return html`<div>Loading...</div>`;
    }

    const entities = Array.isArray(this._config.entities) ? this._config.entities : [];
    debugLog("Rendering editor with config:", JSON.stringify(this._config));
    debugLog("Current entities:", entities);

    return html`
      <div class="card-config">
        ${this._showMigrationWarning ? html`
          <div class="migration-warning">
            <div class="migration-warning-title">
              <span class="migration-warning-icon">⚠️</span>
              Configuration Update Required
            </div>
            <div class="migration-warning-text">
              Your configuration uses deprecated properties that will be removed in a future version. 
              The new format organizes settings per todo list for better maintainability.
            </div>
            <div class="migration-warning-properties">
              Deprecated properties found: ${this._legacyConfig.legacyProperties.join(', ')}
            </div>
            <div class="migration-warning-actions">
              <button 
                class="migration-button primary"
                @click=${this._handleAutoMigrate}
              >
                Auto-Migrate Configuration
              </button>
              <button 
                class="migration-button secondary"
                @click=${() => window.open('https://github.com/nutteloost/todo-swipe-card', '_blank')}
              >
                Go To README
              </button>
            </div>
          </div>
        ` : ''}

        <div class="info-panel">
          <div class="info-icon">i</div>
          <div class="info-text">
            Click the arrow button next to each todo list to expand and configure entity selection and sorting options.
          </div>
        </div>

        <!-- Todo Lists Section -->
        <div class="todo-lists-container">
          <div class="section-header">Todo Lists</div>
          
          <div class="card-list">
            ${entities.length === 0 ?
              html`<div class="no-cards">No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.</div>` :
              entities.map((entity, index) => {
                const descriptor = this._getEntityDescriptor(entity);
                const isExpanded = this._expandedEntities.has(index);
                const entityConfig = this._getEntityConfigAtIndex(index);
                
                return html`
                  <div 
                    class="card-row clickable-row ${isExpanded ? 'expanded' : ''}" 
                    data-index=${index} 
                    @click=${() => this._toggleExpanded(index)}
                    role="button"
                    tabindex="0"
                    aria-expanded=${isExpanded}
                    aria-label="Todo list ${index + 1}: ${descriptor.displayName}. Click to ${isExpanded ? 'collapse' : 'expand'}"
                    @keydown=${(e) => this._handleRowKeydown(e, index)}
                  >
                    <div class="card-info">
                      <ha-icon-button
                        class="expand-button leading"
                        label=${isExpanded ? "Collapse" : "Expand"}
                        path=${isExpanded ? "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" : "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}
                        @click=${(e) => this._handleExpandClick(e, index)}
                      ></ha-icon-button>
                      <span class="card-index">${index + 1}</span>
                      <span class="card-type">${descriptor.displayName}</span>
                      ${entityConfig.entity && entityConfig.entity.trim() !== "" ? 
                        html`<span class="card-name">(${entityConfig.entity})</span>` : 
                        html`<span class="card-name" style="color: var(--error-color);">(Not configured)</span>`
                      }
                    </div>
                    <div class="card-actions" @click=${this._stopPropagation}>
                      <ha-icon-button
                        label="Move Up"
                        ?disabled=${index === 0}
                        path="M7,15L12,10L17,15H7Z"
                        @click=${(e) => this._handleActionClick(e, () => this._moveEntity(index, -1))}
                      ></ha-icon-button>
                      <ha-icon-button
                        label="Move Down"
                        ?disabled=${index === entities.length - 1}
                        path="M7,9L12,14L17,9H7Z"
                        @click=${(e) => this._handleActionClick(e, () => this._moveEntity(index, 1))}
                      ></ha-icon-button>
                      <ha-icon-button
                        label="Delete Todo List"
                        path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                        @click=${(e) => this._handleActionClick(e, () => this._removeEntity(index))}
                        style="color: var(--error-color);"
                      ></ha-icon-button>
                    </div>
                  </div>
                  ${isExpanded ? html`
                    <div class="expanded-content">
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${entityConfig.entity}
                        .includeDomains=${['todo']}
                        .includeEntities=${this._getAvailableEntities(index)}
                        data-index=${index}
                        @value-changed=${this._entityChanged}
                        allow-custom-entity
                        label="Todo Entity"
                      ></ha-entity-picker>
                      
                      ${entityConfig.entity && entityConfig.entity.trim() !== "" ? html`
                        <div style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;">
                          <div class="toggle-option" style="margin: 8px 0;">
                            <div class="toggle-option-label">Show Title</div>
                            <ha-switch
                              .checked=${entityConfig.show_title}
                              data-index=${index}
                              @change=${this._entityTitleEnabledChanged}
                            ></ha-switch>
                          </div>
                          
                          ${entityConfig.show_title ? html`
                            <ha-textfield
                              label="Title Text"
                              .value=${entityConfig.title}
                              data-index=${index}
                              @input=${this._entityTitleTextChanged}
                              style="width: 100%; margin-top: 8px;"
                            ></ha-textfield>
                          ` : ''}
                        </div>

                        <ha-select
                          .label=${"Display Order"}
                          .value=${entityConfig.display_order}
                          data-index=${index}
                          @selected=${this._entityDisplayOrderChanged}
                          @closed=${this._stopPropagation}
                          style="margin-bottom: 8px;"
                        >
                          ${this._getSortModeOptions().map(option => html`
                            <mwc-list-item .value=${option.value}>
                              ${option.label}
                            </mwc-list-item>
                          `)}
                        </ha-select>

                        <ha-textfield
                          label="Background Image URL"
                          .value=${entityConfig.background_image}
                          data-index=${index}
                          @input=${this._entityBackgroundImageChanged}
                          style="width: 100%; margin-top: 4px;"
                          helper="Optional. Enter the path to an image (e.g., /local/images/bg.jpg)"
                        ></ha-textfield>
                      ` : ''}
                    </div>
                  ` : ''}
                `;
              })
            }
          </div>
          
          <div class="add-entity-button">
            <button 
              class="add-todo-button ${this._buttonFeedbackState !== 'normal' ? this._buttonFeedbackState : ''}"
              @click=${(e) => this._addEntity(e)}
            >
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

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this._show_completed}
              data-config-value="show_completed"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

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

        <!-- Background images - only show for legacy configs -->
        ${this._showBackgroundImagesSection ? html`
          <div class="background-images-container">
            <div class="section-header">Background Images (Legacy)</div>
            <div class="background-help-text">
              ⚠️ This section is deprecated. Use the background image field in each entity's expanded configuration instead.
            </div>
            ${this._validEntities.map(entity => {
              const entityId = this._getEntityId(entity);
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
          <div class="version-badge">v${VERSION}</div>
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
  `%c TODO-SWIPE-CARD %c v${VERSION} %c - A swipeable card for to-do lists`,
  "color: white; background: #4caf50; font-weight: 700;",
  "color: #4caf50; background: white; font-weight: 700;",
  "color: grey; background: white; font-weight: 400;"
);
