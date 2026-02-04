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
    if (!this.cardInstance._dragDropInitialized) {
      this.cardInstance._dragDropInitialized = new Set();
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

      // Create new subscription - it will trigger initial update via subscription event
      const unsubscribe = await subscribeToTodoItems(entityId, this._hass);
      this.cardInstance._todoSubscriptions.set(entityId, unsubscribe);

      // NOTE: Removed redundant initial fetch - subscription event will handle initial update
    }

    return finalElement;
  }

  /**
   * Initialize drag-and-drop for a card
   * @param {HTMLElement} cardElement - Card element
   * @param {string} entityId - Entity ID
   * @param {boolean} force - Force re-initialization
   */
  async initializeDragAndDrop(cardElement, entityId, force = false) {
    const entityState = this._hass?.states?.[entityId];
    if (!entityState || !entitySupportsFeature(entityState, 8)) {
      return;
    }

    if (!force && this.cardInstance._dragDropInitialized.has(entityId)) {
      return;
    }

    let listContainer = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      listContainer = cardElement.querySelector('.native-todo-card .todo-list');
    } else if (cardElement.classList.contains('native-todo-card')) {
      listContainer = cardElement.querySelector('.todo-list');
    } else {
      listContainer = cardElement.querySelector('.todo-list');
    }

    if (!listContainer) {
      return;
    }

    try {
      const items = this.cardInstance._todoItemsCache?.get(entityId) || [];
      const { setupDragAndDrop } = await import('../features/DragDrop.js');
      setupDragAndDrop(listContainer, entityId, items, this._hass);
      this.cardInstance._dragDropInitialized.add(entityId);
      debugLog(`Drag-and-drop initialized for ${entityId}`);
    } catch (error) {
      console.error(`Error initializing drag-and-drop for ${entityId}:`, error);
    }
  }

  createAddRow(entityId) {
    const addRow = document.createElement('div');
    addRow.className = 'add-row';

    const textField = document.createElement('div');
    textField.className = 'add-textfield';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = this._config.enable_search ? 'Type to search / add' : 'Add item';

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
          if (this._config.enable_search) {
            handleSearchKeydown(
              e,
              entityId,
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper'),
              input,
              this.cardInstance
            );
          } else {
            this.cardInstance._addTodoItem(entityId, value);
            input.value = '';
            input.focus();
          }
        }
      } else if (e.key === 'Escape' && this._config.enable_search) {
        input.value = '';
        this.cardInstance._searchStates.delete(entityId);
        this.cardInstance._currentSearchText = '';
        const cardElement =
          input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
        if (cardElement) {
          this.updateNativeTodoCard(cardElement, entityId);
        }
      }
    });

    textField.appendChild(input);
    addRow.appendChild(textField);

    if (this._config.show_addbutton) {
      const addButton = document.createElement('button');
      addButton.className = 'add-button';
      addButton.title = 'Add item';
      addButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;

      addButton.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
          if (this._config.enable_search) {
            this.cardInstance._searchStates.delete(entityId);
            this.cardInstance._currentSearchText = '';
            input.value = '';

            const entityState = this.cardInstance._hass?.states?.[entityId];
            const items = entityState?.attributes?.items || [];
            const exactMatch = items.some(
              (item) => item.summary.toLowerCase() === value.toLowerCase()
            );

            if (!exactMatch) {
              this.cardInstance._addTodoItem(entityId, value);
            }

            const cardElement =
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
            if (cardElement) {
              this.updateNativeTodoCard(cardElement, entityId);
            }
          } else {
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

  async updateNativeTodoCard(cardElement, entityId) {
    debugLog(`Starting updateNativeTodoCard for ${entityId}`);

    if (!this._hass || !entityId) {
      return;
    }

    const entityState = this._hass.states[entityId];
    if (!entityState) {
      return;
    }

    let items = [];

    // Check if we have cached items from the subscription (most up-to-date source)
    // Use has() to properly handle empty arrays (valid empty todo lists)
    if (this.cardInstance._todoItemsCache?.has(entityId)) {
      // Use cached subscription data - it's the freshest source
      items = this.cardInstance._todoItemsCache.get(entityId) || [];
      debugLog(`Using ${items.length} cached items for ${entityId}`);
    } else {
      // No cache, fetch fresh items
      try {
        items = await fetchTodoItems(entityId, this._hass);
        debugLog(`Fetched ${items.length} fresh items for ${entityId}`);

        if (!this.cardInstance._todoItemsCache) {
          this.cardInstance._todoItemsCache = new Map();
        }
        this.cardInstance._todoItemsCache.set(entityId, items);
      } catch (error) {
        items = entityState.attributes?.items || [];
      }
    }

    let listContainer = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      listContainer = cardElement.querySelector('.native-todo-card .todo-list');
    } else if (cardElement.classList.contains('native-todo-card')) {
      listContainer = cardElement.querySelector('.todo-list');
    } else {
      listContainer = cardElement.querySelector('.todo-list');
    }

    if (!listContainer) {
      let targetCard = cardElement;
      if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
        targetCard = cardElement.querySelector('.native-todo-card');
      }

      if (targetCard) {
        listContainer = document.createElement('div');
        listContainer.className = 'todo-list';
        targetCard.appendChild(listContainer);
      } else {
        return;
      }
    }

    const entityConfig = this._getEntityConfig(entityId);
    const allSortedItems = sortTodoItems(items, entityConfig?.display_order, this._hass);
    const searchText = this.cardInstance._searchStates.get(entityId) || '';
    const isSearchActive = searchText && searchText.trim() !== '';

    let visibleItems = allSortedItems;

    if (!isSearchActive && entityConfig?.hide_future_items) {
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      visibleItems = visibleItems.filter((item) => {
        if (item.status === 'completed' || !item.due) {
          return true;
        }
        try {
          const dueDate = new Date(item.due);
          return dueDate <= now;
        } catch (e) {
          return true;
        }
      });
    }

    if (!isSearchActive && entityConfig?.max_items && typeof entityConfig.max_items === 'number') {
      const incompleteItems = visibleItems.filter((item) => item.status !== 'completed');
      const completedItems = visibleItems.filter((item) => item.status === 'completed');
      const limitedIncompleteItems = incompleteItems.slice(0, entityConfig.max_items);
      visibleItems = [...limitedIncompleteItems, ...completedItems];
    }

    const visibleUids = new Set(visibleItems.map((item) => item.uid));

    const searchMatchUids = new Set();
    if (isSearchActive) {
      allSortedItems.forEach((item) => {
        if (matchesSearch(item, searchText)) {
          searchMatchUids.add(item.uid);
        }
      });
    }

    const existingItemsMap = new Map();
    Array.from(listContainer.children).forEach((element) => {
      const uid = element.dataset.itemUid;
      if (uid) {
        existingItemsMap.set(uid, element);
      }
    });

    const processedUids = new Set();
    let hasNewItems = false;

    for (const item of allSortedItems) {
      processedUids.add(item.uid);
      const existingElement = existingItemsMap.get(item.uid);

      const shouldBeVisible =
        visibleUids.has(item.uid) && (isSearchActive ? searchMatchUids.has(item.uid) : true);

      // Check if there's a pending toggle for this item (user just clicked, subscription might have stale data)
      const pendingKey = `${entityId}:${item.uid}`;
      const pendingToggle = this.cardInstance._pendingToggles?.get(pendingKey);

      // Use pending status if available (it's the user's intended state), otherwise use item status
      const effectiveStatus = pendingToggle ? pendingToggle.status : item.status;
      if (pendingToggle) {
        debugLog(
          `Using pending status for "${item.summary}": ${effectiveStatus} (subscription had: ${item.status})`
        );
      }
      const shouldBeCompleted = effectiveStatus === 'completed';
      const hideCompleted = !this._config.show_completed && shouldBeCompleted && !isSearchActive;

      if (existingElement) {
        await this._updateTodoItemElement(existingElement, item, entityState);

        const isCurrentlyCompleted = existingElement.classList.contains('completed');
        if (isCurrentlyCompleted !== shouldBeCompleted) {
          if (shouldBeCompleted) {
            // Item is being completed - remove animation-played so animation plays, then add completed
            existingElement.classList.remove('animation-played');
            existingElement.classList.add('completed');

            // After animation finishes, add animation-played to prevent replay on reorder/search
            const summaryElement = existingElement.querySelector('.todo-summary');
            const addAnimationPlayed = () => {
              existingElement.classList.add('animation-played');
            };

            if (summaryElement) {
              // Listen for animation end
              summaryElement.addEventListener('animationend', addAnimationPlayed, { once: true });
            }
            // Fallback timeout in case animation doesn't fire (reduced motion, no custom animation, etc.)
            setTimeout(addAnimationPlayed, 300);
          } else {
            // Item is being uncompleted - remove both classes
            existingElement.classList.remove('completed', 'animation-played');
          }
        }

        const checkbox = existingElement.querySelector('ha-checkbox');
        if (checkbox && checkbox.checked !== shouldBeCompleted) {
          checkbox.checked = shouldBeCompleted;
        }

        if (!shouldBeVisible || hideCompleted) {
          existingElement.style.display = 'none';
        } else {
          existingElement.style.display = '';
        }
      } else {
        hasNewItems = true;
        try {
          const itemElement = createTodoItemElement(
            item,
            entityId,
            this.cardInstance._toggleTodoItem,
            this.cardInstance._editTodoItem,
            this._hass,
            entityState
          );

          if (!shouldBeVisible || hideCompleted) {
            itemElement.style.display = 'none';
          }

          listContainer.appendChild(itemElement);
          existingItemsMap.set(item.uid, itemElement);
        } catch (e) {
          console.error(`Error creating item element:`, e, item);
        }
      }
    }

    existingItemsMap.forEach((element, uid) => {
      if (!processedUids.has(uid)) {
        element.remove();
      }
    });

    // Use CSS order property to control visual order instead of physically moving DOM elements
    // This prevents CSS animations from restarting when items are reordered
    allSortedItems.forEach((item, index) => {
      const element = existingItemsMap.get(item.uid);
      if (element) {
        element.style.order = index;
      }
    });

    this.updateSearchCounter(
      cardElement,
      entityId,
      searchText,
      isSearchActive ? searchMatchUids.size : visibleItems.length,
      allSortedItems.length
    );

    debugLog(`Finished updating card for ${entityId}`);

    if (hasNewItems && entitySupportsFeature(entityState, 8)) {
      await this.initializeDragAndDrop(cardElement, entityId, true);
    }
  }

  async _updateTodoItemElement(element, item) {
    const summaryElement = element.querySelector('.todo-summary');
    if (summaryElement && summaryElement.textContent !== item.summary) {
      summaryElement.textContent = item.summary;
    }

    const contentElement = element.querySelector('.todo-content');
    if (contentElement) {
      let descriptionElement = contentElement.querySelector('.todo-description');

      if (item.description) {
        if (descriptionElement) {
          if (descriptionElement.textContent !== item.description) {
            descriptionElement.textContent = item.description;
          }
        } else {
          descriptionElement = document.createElement('div');
          descriptionElement.className = 'todo-description';
          descriptionElement.textContent = item.description;
          if (summaryElement) {
            summaryElement.parentNode.insertBefore(descriptionElement, summaryElement.nextSibling);
          } else {
            contentElement.appendChild(descriptionElement);
          }
        }
      } else if (descriptionElement) {
        descriptionElement.remove();
      }

      const dueElement = contentElement.querySelector('.todo-due');

      if (item.due) {
        const { createDueDateElement } = await import('../ui/DomHelpers.js');
        const newDueElement = createDueDateElement(item.due);

        const relativeTime = newDueElement.querySelector('ha-relative-time');
        if (relativeTime && this._hass) {
          relativeTime.hass = this._hass;
        }

        if (dueElement) {
          dueElement.replaceWith(newDueElement);
        } else {
          contentElement.appendChild(newDueElement);
        }
      } else if (dueElement) {
        dueElement.remove();
      }
    }
  }

  updateSearchCounter(cardElement, entityId, searchText, filteredCount, totalCount) {
    let addRow = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      addRow = cardElement.querySelector('.native-todo-card .add-row');
    } else {
      addRow = cardElement.querySelector('.add-row');
    }

    if (!addRow) return;

    const existingCounter = cardElement.querySelector('.search-counter');
    if (existingCounter) {
      existingCounter.remove();
    }

    if (searchText && searchText.trim() !== '' && totalCount > 0) {
      addRow.classList.add('has-search-counter');

      const counter = document.createElement('div');
      counter.className = 'search-counter';
      counter.textContent = `Showing ${filteredCount} of ${totalCount} results`;

      addRow.parentNode.insertBefore(counter, addRow.nextSibling);
    } else {
      addRow.classList.remove('has-search-counter');
    }
  }
}
