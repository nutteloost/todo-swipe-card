import { LitElement, html } from './Dependencies.js';
import { debugLog } from '../utils/Debug.js';
import { createBaseStyles } from '../ui/Styles.js';
import { buildPreview } from '../ui/DomHelpers.js';
import { addSwipeGestures } from '../features/SwipeGestures.js';
import { cleanupSearchHandlers } from '../features/SearchFunctionality.js';
import { createPagination, updatePaginationDots } from '../features/Pagination.js';
import { DialogManager } from './DialogManager.js';
import { CardBuilder } from './CardBuilder.js';
import { SubscriptionManager } from './SubscriptionManager.js';
import { addTodoItem, toggleTodoItem, deleteCompletedItems } from '../features/TodoOperations.js';

/**
 * TodoSwipeCard: A custom card for Home Assistant to display multiple todo lists with swipe navigation
 * @extends LitElement
 */
export class TodoSwipeCard extends LitElement {
  constructor() {
    super();

    this._config = {};
    this._hass = null;
    this.cards = [];
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    this.initialized = false;
    this._dynamicStyleElement = null;
    this._configUpdateTimer = null;
    this._buildPromise = null;
    this._lastConfig = null;
    this._updateThrottle = null;
    this._lastHassUpdate = null;
    this._todoSubscriptions = new Map(); // Track todo subscriptions per entity
    this._deleteButtonColor = null;

    // Search functionality properties
    this._searchStates = new Map(); // Track search state per entity
    this._currentSearchText = '';
    this._searchInputHandlers = new Map(); // Track input handlers per card

    this._todoItemsCache = new Map(); // Cache for todo items per entity
    this._isAddingItem = false;

    // Initialize dialog manager
    this.dialogManager = new DialogManager(this);

    // Initialize card builder
    this.cardBuilder = new CardBuilder(this);

    // Initialize subscription manager
    this.subscriptionManager = new SubscriptionManager(this);

    // Bind methods to ensure proper context
    this._addTodoItem = this._addTodoItem.bind(this);
    this._toggleTodoItem = this._toggleTodoItem.bind(this);
    this._editTodoItem = this._editTodoItem.bind(this);
  }

  /**
   * Render method for LitElement compatibility
   * @returns {TemplateResult|void}
   */
  render() {
    // For LitElement, return empty template as we handle rendering manually
    return html``;
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
      show_icons: false,
      show_create: true,
      show_addbutton: false,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false,
      enable_search: false,
      clear_search_on_uncheck: false
    };
  }

  /**
   * Returns the editor element for the card
   * @returns {HTMLElement} Card editor element
   */
  static getConfigElement() {
    return document.createElement('todo-swipe-card-editor');
  }

  /**
   * Check if there are valid entities configured
   * @returns {boolean} True if valid entities are present
   * @private
   */
  _hasValidEntities() {
    return (
      this._config &&
      this._config.entities &&
      Array.isArray(this._config.entities) &&
      this._config.entities.length > 0 &&
      this._config.entities.some((entity) => {
        if (typeof entity === 'string') {
          return entity && entity.trim() !== '';
        }
        return entity && entity.entity && entity.entity.trim() !== '';
      })
    );
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
   * Get entity configuration by ID
   * @param {string} entityId - Entity ID to find
   * @returns {Object|null} Entity configuration object or null if not found
   * @private
   */
  _getEntityConfig(entityId) {
    if (!this._config?.entities) return null;

    const entity = this._config.entities.find((entity) => this._getEntityId(entity) === entityId);

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
      const cssText = this._config.card_mod.style;

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
    if (!this.sliderElement || !this._config) return;

    try {
      // Default values
      let transitionSpeed = '0.3s';
      let transitionEasing = 'ease-out';

      // Extract transition properties from card_mod style - check both locations
      const cardModConfig = this._config.card_mod || this._config.custom_card_mod;
      if (cardModConfig && typeof cardModConfig.style === 'string') {
        const styleString = cardModConfig.style;

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
      console.error('Error applying transition properties:', e);
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
    deleteButtons.forEach((button) => {
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
    debugLog('setConfig called with:', JSON.stringify(config));

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
    entities = entities
      .map((entity) => {
        if (typeof entity === 'string') {
          // Convert string to object format, but keep it as string if empty
          return entity.trim() === '' ? entity : { entity: entity };
        }
        return entity; // Already object format
      })
      .filter((entity) => {
        if (typeof entity === 'string') {
          return entity !== ''; // Keep non-empty strings
        }
        return entity && (entity.entity || entity.entity === ''); // Keep objects with entity property
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

    // Handle card_mod configuration - keep it as card_mod for consistency
    if (
      config.card_mod &&
      typeof config.card_mod === 'object' &&
      Object.keys(config.card_mod).length > 0
    ) {
      newConfig.card_mod = config.card_mod;
    } else if (
      config.custom_card_mod &&
      typeof config.custom_card_mod === 'object' &&
      Object.keys(config.custom_card_mod).length > 0
    ) {
      newConfig.card_mod = config.custom_card_mod;
    }

    // Check if config actually changed
    if (!this._hasConfigChanged(newConfig)) {
      debugLog('Config unchanged, skipping update');
      return;
    }

    // Save the old config for comparison
    const oldConfig = this._config;
    this._config = newConfig;
    this._lastConfig = JSON.parse(JSON.stringify(newConfig));

    debugLog('Config after processing:', JSON.stringify(this._config));

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
          debugLog('Rebuilding TodoSwipeCard due to significant config change');
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
    const entitiesChanged =
      JSON.stringify(oldConfig.entities) !== JSON.stringify(newConfig.entities);
    const paginationChanged = oldConfig.show_pagination !== newConfig.show_pagination;
    const createFieldChanged = oldConfig.show_create !== newConfig.show_create;
    const cardModChanged =
      JSON.stringify(oldConfig.card_mod) !== JSON.stringify(newConfig.card_mod);
    const searchChanged = oldConfig.enable_search !== newConfig.enable_search;

    return (
      entitiesChanged || paginationChanged || createFieldChanged || cardModChanged || searchChanged
    );
  }

  /**
   * Updates specific card features without a full rebuild
   * Optimized version
   * @param {Object} oldConfig - Previous configuration
   * @private
   */
  _updateFromConfig(oldConfig) {
    debugLog('Applying minor config updates');

    // Batch DOM updates using requestAnimationFrame
    requestAnimationFrame(() => {
      // Update show_completed setting
      if (this._config.show_completed !== oldConfig.show_completed) {
        this.cards.forEach((card) => {
          if (card.element) {
            const items = card.element.querySelectorAll('.todo-item.completed');
            items.forEach((item) => {
              item.style.display = this._config.show_completed ? '' : 'none';
            });
          }
        });
      }

      // Update show_completed_menu setting
      if (
        this._config.show_completed_menu !== oldConfig.show_completed_menu ||
        this._config.show_completed !== oldConfig.show_completed
      ) {
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
      if (
        JSON.stringify(this._config.card_mod || this._config.custom_card_mod) !==
        JSON.stringify(oldConfig.card_mod || oldConfig.custom_card_mod)
      ) {
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
    this.cards.forEach((card) => {
      const slide = card.slide;
      if (!slide) return;

      // Remove existing delete buttons
      const oldButtons = slide.querySelectorAll('.delete-completed-button');
      oldButtons.forEach((btn) => btn.remove());

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
        this.dialogManager.showDeleteCompletedConfirmation(entityId);
      } else {
        // No confirmation needed, delete immediately
        deleteCompletedItems(entityId, this._hass);
      }
    });

    return deleteButton;
  }

  /**
   * Enhanced hass setter to set up subscriptions when cards are ready
   */
  set hass(hass) {
    if (!hass) return;

    const previousHass = this._hass;
    this._hass = hass;

    // Initialize subscriptions through subscription manager
    this.subscriptionManager.initializeSubscriptions(hass, previousHass);
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback() {
    super.connectedCallback();

    // Setup event listeners through subscription manager
    this.subscriptionManager.setupEventListeners();

    // Ensure we have a valid config before proceeding
    if (!this._config) {
      debugLog('TodoSwipeCard connected but no config available');
      return;
    }

    if (!this.initialized) {
      debugLog('TodoSwipeCard connecting and building');
      this._applyCardModStyles();

      // Small delay to ensure renderRoot is ready
      setTimeout(() => {
        this._build();
      }, 0);
    }
  }

  /**
   * Called when the element is disconnected from the DOM
   * Improved cleanup for better memory management (simplified from old version)
   */
  disconnectedCallback() {
    debugLog('TodoSwipeCard disconnecting - performing cleanup');

    // Clear all timers first to prevent any pending operations
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

    // Clean up subscriptions, caches, and event listeners through subscription manager
    this.subscriptionManager.cleanup();

    // Clean up search functionality
    cleanupSearchHandlers(this);

    // Properly remove swipe gesture handlers (simplified)
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

    debugLog('TodoSwipeCard cleanup completed');
  }

  /**
   * Build the card UI with optimized DOM handling
   * Now returns a promise for better async handling
   * @private
   */
  async _build() {
    // Prevent concurrent builds
    if (this._buildPromise) {
      debugLog('Build already in progress, waiting...');
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
   * Enhanced build method with better initialization
   */
  async _doBuild() {
    debugLog('Starting build...');

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const root = this.renderRoot || this.shadowRoot;
    if (!root) {
      console.error('No render root available');
      return;
    }
    root.innerHTML = ''; // Clear previous content

    // Add base styles
    const style = createBaseStyles(this._config);
    fragment.appendChild(style);

    // Re-add the dynamic style element if it exists
    if (this._dynamicStyleElement) {
      fragment.appendChild(this._dynamicStyleElement);
    }

    // Check if we should show the preview (no valid entities configured)
    if (!this._hasValidEntities()) {
      buildPreview(fragment);
      root.appendChild(fragment);
      this.initialized = true;
      debugLog('Preview build completed');
      return;
    }

    // Regular card layout - only proceed if we have valid entities
    debugLog('Building regular card layout');

    // Create container
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-container';

    // Create slider
    this.sliderElement = document.createElement('div');
    this.sliderElement.className = 'slider';
    this.cardContainer.appendChild(this.sliderElement);
    fragment.appendChild(this.cardContainer);

    // Append to DOM BEFORE creating cards (important for timing)
    root.appendChild(fragment);

    // Initialize cards array
    this.cards = [];

    // Create slides for each todo entity (now that DOM is ready)
    try {
      await this.cardBuilder.createNativeTodoCards();
    } catch (error) {
      console.error('Error creating native todo cards:', error);
      // Continue with initialization even if card creation fails
    }

    // Create pagination if enabled (and more than one card)
    if (this._config.show_pagination !== false && this.cards.length > 1) {
      createPagination(this);
    } else {
      this.paginationElement = null;
    }

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
      this.cards.forEach((cardData) => {
        if (cardData.slide) {
          cardData.slide.style.borderRadius = cardBorderRadius;
        }
      });

      this.updateSlider(false); // Update without animation initially

      // Setup resize observer only after initial layout
      this._setupResizeObserver();

      // IMPORTANT: Force initial update of all cards after DOM is ready
      debugLog('Forcing initial update of all cards');
      this.cards.forEach((card, index) => {
        if (card && card.element && card.entityId) {
          debugLog(`Force updating card ${index} for entity ${card.entityId}`);
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            this.cardBuilder.updateNativeTodoCard(card.element, card.entityId);
          }, 50 * index); // Stagger updates slightly
        }
      });
    });

    // Add swipe detection only if more than one card
    if (this.cards.length > 1) {
      addSwipeGestures(this);
    }

    // Apply transition properties
    setTimeout(() => {
      this._applyTransitionProperties();
    }, 200);

    // Mark as initialized AFTER build completes
    this.initialized = true;
    debugLog('Regular card build completed.');
  }

  /**
   * Add a new todo item
   * @param {string} entityId - Entity ID
   * @param {string} summary - Item summary
   * @private
   */
  _addTodoItem(entityId, summary) {
    addTodoItem(entityId, summary, this._hass);
  }

  /**
   * Toggle todo item completion status
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   * @param {boolean} completed - New completion status
   * @private
   */
  _toggleTodoItem(entityId, item, completed) {
    toggleTodoItem(entityId, item, completed, this._hass);

    // Clear search when unchecking an item (if enabled)
    if (!completed && this._config.clear_search_on_uncheck && this._config.enable_search) {
      const searchText = this._searchStates.get(entityId);
      if (searchText && searchText.trim() !== '') {
        debugLog(`Clearing search after unchecking item "${item.summary}"`);
        this._searchStates.delete(entityId);
        this._currentSearchText = '';

        // Find and clear the input field, then update the card
        const card = this.cards.find((c) => c.entityId === entityId);
        if (card && card.element) {
          let inputElement;
          if (card.element.classList.contains('todo-card-with-title-wrapper')) {
            inputElement = card.element.querySelector('.native-todo-card .add-textfield input');
          } else {
            inputElement = card.element.querySelector('.add-textfield input');
          }
          if (inputElement) {
            inputElement.value = '';
          }

          // Update the card to refresh the display
          this.cardBuilder.updateNativeTodoCard(card.element, entityId);
        }
      }
    }
  }

  /**
   * Edit todo item using the dialog manager
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   * @private
   */
  _editTodoItem(entityId, item) {
    this.dialogManager.editTodoItem(entityId, item);
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
          debugLog('Resizing slider...');
          this.slideWidth = newWidth;

          // Batch DOM updates
          requestAnimationFrame(() => {
            // Reapply border radius when resizing
            const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
            this.cards.forEach((cardData) => {
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
   * @param {boolean} animate - Whether to animate the transition
   */
  updateSlider(animate = true) {
    if (!this.sliderElement || !this.slideWidth || this.cards.length === 0 || !this.initialized) {
      return;
    }

    // Batch all DOM updates
    requestAnimationFrame(() => {
      // Re-check if elements still exist inside requestAnimationFrame
      if (!this.sliderElement || !this.cardContainer || !this.initialized) {
        return;
      }

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
      updatePaginationDots(this);

      // Handle search state when sliding to a new card
      if (this._config.enable_search && this.cards[this.currentIndex]) {
        // Don't restore search state - always start with clean slate
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
