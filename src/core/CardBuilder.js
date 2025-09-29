import { debugLog } from '../utils/Debug.js';
import { createCardWithTitle, createIconElement } from '../ui/DomHelpers.js';
import {
  setupSearchForCard,
  matchesSearch,
  handleSearchKeydown
} from '../features/SearchFunctionality.js';
import {
  subscribeToTodoItems,
  fetchTodoItems,
  sortTodoItems,
  createTodoItemElement,
  entitySupportsFeature
} from '../features/TodoOperations.js';

/**
 * CardBuilder handles all card building and rendering functionality for TodoSwipeCard
 * Manages card creation, updates, and rendering logic
 */
export class CardBuilder {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;
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
   * Create native todo cards from entities
   */
  async createNativeTodoCards() {
    // Ensure sliderElement exists before proceeding
    if (!this.cardInstance.sliderElement) {
      debugLog('sliderElement is null at start of createNativeTodoCards');
      return;
    }

    // Check for build cancellation
    if (this.cardInstance._buildCanceled) {
      debugLog('Card creation canceled before starting');
      return;
    }

    // Store reference to slider element to check for changes
    const initialSlider = this.cardInstance.sliderElement;

    // Process entities sequentially for better performance
    for (let i = 0; i < this._config.entities.length; i++) {
      // Check for cancellation at each iteration
      if (this.cardInstance._buildCanceled) {
        debugLog('Card creation canceled during processing');
        return;
      }

      const entityConfig = this._config.entities[i];
      const entityId = this._getEntityId(entityConfig);

      if (!entityId || entityId.trim() === '') {
        continue;
      }

      // Check if slider element is still the same (hasn't been rebuilt)
      if (this.cardInstance.sliderElement !== initialSlider) {
        debugLog('sliderElement changed during card creation - build was interrupted');
        return;
      }

      // Check if slider element still exists
      if (!this.cardInstance.sliderElement) {
        debugLog('sliderElement became null during card creation');
        return;
      }

      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';

      try {
        // Create native todo card element
        const cardElement = await this.createNativeTodoCard(entityConfig);

        // Check for cancellation after async operation
        if (this.cardInstance._buildCanceled) {
          debugLog('Card creation canceled after creating card element');
          return;
        }

        // Store reference to the card
        this.cardInstance.cards[i] = {
          element: cardElement,
          slide: slideDiv,
          entityId: entityId,
          entityConfig: entityConfig
        };

        // Add card to slide
        slideDiv.appendChild(cardElement);

        // Add custom delete button if configured
        if (this._config.show_completed && this._config.show_completed_menu) {
          const deleteButton = this.cardInstance._createDeleteButton(entityId, entityConfig);
          slideDiv.appendChild(deleteButton);
        }

        // Add icon if configured
        if (this._config.show_icons) {
          const iconElement = createIconElement(entityConfig, entityId, this._hass);
          slideDiv.appendChild(iconElement);
        }

        // Final check before appending - ensure slider still exists and is the same
        if (
          this.cardInstance.sliderElement &&
          this.cardInstance.sliderElement === initialSlider &&
          !this.cardInstance._buildCanceled
        ) {
          this.cardInstance.sliderElement.appendChild(slideDiv);
          debugLog(`Created native todo card for entity: ${entityId}`);
        } else {
          debugLog('sliderElement changed, became null, or build canceled before appending slide');
          return;
        }
      } catch (e) {
        if (!this.cardInstance._buildCanceled) {
          console.error(`Error creating native todo card ${i}:`, entityId, e);
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText =
            'color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;';
          errorDiv.textContent = `Error creating card: ${e.message || e}. Check console for details.`;
          slideDiv.appendChild(errorDiv);

          // Check if sliderElement exists before appending error
          if (
            this.cardInstance.sliderElement &&
            this.cardInstance.sliderElement === initialSlider
          ) {
            this.cardInstance.sliderElement.appendChild(slideDiv);
          }
          this.cardInstance.cards[i] = { error: true, slide: slideDiv };
        }
      }
    }

    // Filter out any potential gaps if errors occurred
    this.cardInstance.cards = this.cardInstance.cards.filter(Boolean);
    debugLog(`Card creation completed. Created ${this.cardInstance.cards.length} cards`);
  }

  /**
   * Create native todo card
   * @param {Object} entityConfig - Entity configuration
   * @returns {Promise<HTMLElement>} Card element
   */
  async createNativeTodoCard(entityConfig) {
    const entityId = this._getEntityId(entityConfig);
    debugLog('Creating native todo card for entity:', entityId);

    // Initialize cache if needed
    if (!this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache = new Map();
    }
    if (!this.cardInstance._todoSubscriptions) {
      this.cardInstance._todoSubscriptions = new Map();
    }

    // Create the main card element
    const cardElement = document.createElement('div');
    cardElement.className = 'native-todo-card';

    // Apply background image if configured
    if (typeof entityConfig === 'object' && entityConfig.background_image) {
      cardElement.style.backgroundImage = `url('${entityConfig.background_image}')`;
      cardElement.style.backgroundPosition = 'center center';
      cardElement.style.backgroundRepeat = 'no-repeat';
      cardElement.style.backgroundSize = 'cover';
    }

    let finalElement = cardElement;

    // Handle title wrapper
    const showTitle = (typeof entityConfig === 'object' && entityConfig.show_title) || false;
    const titleText = (typeof entityConfig === 'object' && entityConfig.title) || '';
    if (showTitle && titleText) {
      finalElement = createCardWithTitle(cardElement, titleText);
    }

    // Create add row if enabled
    if (this._config.show_create) {
      const addRow = this.createAddRow(entityId);
      cardElement.appendChild(addRow);
    }

    // Create todo list container
    const listContainer = document.createElement('div');
    listContainer.className = 'todo-list';
    cardElement.appendChild(listContainer);

    // Set up search functionality if enabled
    if (this._config.enable_search && this._config.show_create) {
      setupSearchForCard(cardElement, entityId, this.cardInstance);
    }

    // Set up subscription if hass is available
    if (this._hass) {
      debugLog('Setting up todo subscription for', entityId);

      // Clean up any existing subscription
      const existingUnsub = this.cardInstance._todoSubscriptions.get(entityId);
      if (existingUnsub && typeof existingUnsub === 'function') {
        try {
          existingUnsub();
        } catch (e) {
          debugLog('Error cleaning up subscription:', e);
        }
      }

      // Create new subscription
      const unsubscribe = await subscribeToTodoItems(entityId, this._hass);
      this.cardInstance._todoSubscriptions.set(entityId, unsubscribe);

      // Do initial fetch
      debugLog('Doing initial fetch for', entityId);
      setTimeout(async () => {
        await this.updateNativeTodoCard(finalElement, entityId);
      }, 100);
    }

    return finalElement;
  }

  /**
   * Create add item row
   * @param {string} entityId - Entity ID
   * @returns {HTMLElement} Add row element
   */
  createAddRow(entityId) {
    const addRow = document.createElement('div');
    addRow.className = 'add-row';

    // Create text input
    const textField = document.createElement('div');
    textField.className = 'add-textfield';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = this._config.enable_search ? 'Type to search / add' : 'Add item';

    // Add keydown handler for Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
          // Check if this is search mode
          if (this._config.enable_search) {
            // Use the search functionality
            handleSearchKeydown(
              e,
              entityId,
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper'),
              input,
              this.cardInstance
            );
          } else {
            // Non-search mode - just add the item
            this.cardInstance._addTodoItem(entityId, value);
            input.value = '';
            input.focus();
          }
        }
      } else if (e.key === 'Escape' && this._config.enable_search) {
        // Clear search on Escape
        input.value = '';
        this.cardInstance._searchStates.delete(entityId);
        this.cardInstance._currentSearchText = '';
        // Find the card element and update it
        const cardElement =
          input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
        if (cardElement) {
          this.updateNativeTodoCard(cardElement, entityId);
        }
      }
    });

    textField.appendChild(input);
    addRow.appendChild(textField);

    // Create add button if enabled
    if (this._config.show_addbutton) {
      const addButton = document.createElement('button');
      addButton.className = 'add-button';
      addButton.title = 'Add item';
      addButton.innerHTML = `
       <svg viewBox="0 0 24 24">
         <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
       </svg>
     `;

      addButton.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
          // Check if this is search mode - same logic as Enter key
          if (this._config.enable_search) {
            // CLEAR SEARCH STATE FIRST - before doing anything else
            debugLog(`Clearing search state for ${entityId} BEFORE adding item (+ button)`);
            this.cardInstance._searchStates.delete(entityId);
            this.cardInstance._currentSearchText = '';
            input.value = '';

            // Check if the search text matches any existing items
            const entityState = this.cardInstance._hass?.states?.[entityId];
            const items = entityState?.attributes?.items || [];
            const exactMatch = items.some(
              (item) => item.summary.toLowerCase() === value.toLowerCase()
            );

            if (!exactMatch) {
              debugLog(`No exact match found, adding item: "${value}" (+ button)`);
              // Add new item since no exact match found
              this.cardInstance._addTodoItem(entityId, value);
            } else {
              debugLog(`Exact match found, not adding item: "${value}" (+ button)`);
            }

            // Update the card to clear search display
            const cardElement =
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
            if (cardElement) {
              this.updateNativeTodoCard(cardElement, entityId);
            }
          } else {
            // Non-search mode - just add the item (original behavior)
            this.cardInstance._addTodoItem(entityId, value);
            input.value = '';
          }
          input.focus();
        }
      });

      addRow.appendChild(addButton);
    }

    return addRow;
  }

  /**
   * Update native todo card
   * @param {HTMLElement} cardElement - Card element
   * @param {string} entityId - Entity ID
   */
  async updateNativeTodoCard(cardElement, entityId) {
    debugLog(`Starting updateNativeTodoCard for ${entityId}`);

    if (!this._hass || !entityId) {
      debugLog('No hass or entityId provided');
      return;
    }

    const entityState = this._hass.states[entityId];
    if (!entityState) {
      debugLog(`Entity ${entityId} not found in hass.states`);
      return;
    }

    // Always fetch fresh items instead of relying on cache
    let items = [];
    try {
      items = await fetchTodoItems(entityId, this._hass);
      debugLog(`Fetched ${items.length} fresh items for ${entityId}`);

      // Update cache with fresh items
      if (!this.cardInstance._todoItemsCache) {
        this.cardInstance._todoItemsCache = new Map();
      }
      this.cardInstance._todoItemsCache.set(entityId, items);
    } catch (error) {
      debugLog(`Failed to fetch items for ${entityId}, trying cache:`, error);

      // Fallback to cache if fetch fails
      if (this.cardInstance._todoItemsCache && this.cardInstance._todoItemsCache.has(entityId)) {
        items = this.cardInstance._todoItemsCache.get(entityId) || [];
        debugLog(`Using ${items.length} cached items for ${entityId}`);
      } else {
        // Last resort: try to get from entity attributes
        items = entityState.attributes?.items || [];
        debugLog(`Using ${items.length} items from entity attributes for ${entityId}`);
      }
    }

    // Find the list container
    let listContainer = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      listContainer = cardElement.querySelector('.native-todo-card .todo-list');
    } else if (cardElement.classList.contains('native-todo-card')) {
      listContainer = cardElement.querySelector('.todo-list');
    } else {
      listContainer = cardElement.querySelector('.todo-list');
    }

    if (!listContainer) {
      debugLog('Creating missing list container');
      let targetCard = cardElement;
      if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
        targetCard = cardElement.querySelector('.native-todo-card');
      }

      if (targetCard) {
        listContainer = document.createElement('div');
        listContainer.className = 'todo-list';
        targetCard.appendChild(listContainer);
      } else {
        debugLog('Could not create list container');
        return;
      }
    }

    // Apply sorting (always use ALL items for search purposes)
    const entityConfig = this._getEntityConfig(entityId);
    const allSortedItems = sortTodoItems(items, entityConfig?.display_order, this._hass);
    const searchText = this.cardInstance._searchStates.get(entityId) || '';
    const isSearchActive = searchText && searchText.trim() !== '';

    debugLog(`Search text for filtering: "${searchText}"`);

    // Filter by search text (if searching, include ALL matching items regardless of completion status)
    const filteredItems = isSearchActive
      ? allSortedItems.filter((item) => matchesSearch(item, searchText))
      : allSortedItems;

    debugLog(
      `Rendering ${filteredItems.length} items for ${entityId} (from ${items.length} total)`
    );

    // Clear and render
    listContainer.innerHTML = '';

    if (filteredItems.length > 0) {
      filteredItems.forEach((item, index) => {
        try {
          const itemElement = createTodoItemElement(
            item,
            entityId,
            this.cardInstance._toggleTodoItem,
            this.cardInstance._editTodoItem,
            this._hass,
            entityState
          );

          // Show completed items when actively searching, otherwise respect show_completed setting
          if (!this._config.show_completed && item.status === 'completed' && !isSearchActive) {
            itemElement.style.display = 'none';
          }

          listContainer.appendChild(itemElement);
        } catch (e) {
          console.error(`Error creating item element ${index}:`, e, item);
        }
      });
    }

    // Update search results counter
    this.updateSearchCounter(
      cardElement,
      entityId,
      searchText,
      filteredItems.length,
      allSortedItems.length
    );

    debugLog(`Finished updating card for ${entityId}`);

    // Setup drag and drop if entity supports it
    if (entitySupportsFeature(entityState, 8)) {
      // Import drag and drop functionality
      const { setupDragAndDrop } = await import('../features/DragDrop.js');
      setupDragAndDrop(listContainer, entityId, filteredItems, this._hass);
      debugLog(`Drag and drop enabled for ${entityId}`);
    }
  }

  /**
   * Update search results counter
   * @param {HTMLElement} cardElement - Card element
   * @param {string} entityId - Entity ID
   * @param {string} searchText - Current search text
   * @param {number} filteredCount - Number of filtered items
   * @param {number} totalCount - Total number of items
   */
  updateSearchCounter(cardElement, entityId, searchText, filteredCount, totalCount) {
    // Find the add row
    let addRow = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      addRow = cardElement.querySelector('.native-todo-card .add-row');
    } else {
      addRow = cardElement.querySelector('.add-row');
    }

    if (!addRow) return;

    // Remove existing counter
    const existingCounter = cardElement.querySelector('.search-counter');
    if (existingCounter) {
      existingCounter.remove();
    }

    // Handle add-row CSS class and counter
    if (searchText && searchText.trim() !== '' && totalCount > 0) {
      // Add CSS class to reduce add-row margin when search counter is present
      addRow.classList.add('has-search-counter');

      // Create and insert counter
      const counter = document.createElement('div');
      counter.className = 'search-counter';
      counter.textContent = `Showing ${filteredCount} of ${totalCount} results`;

      // Insert after the add-row
      addRow.parentNode.insertBefore(counter, addRow.nextSibling);
    } else {
      // Remove CSS class to restore default spacing when no search counter
      addRow.classList.remove('has-search-counter');
    }
  }
}
