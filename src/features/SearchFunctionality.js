import { debugLog } from '../utils/Debug.js';

/**
 * Setup search functionality for a card
 * @param {HTMLElement} cardElement - The card element
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function setupSearchForCard(cardElement, entityId, cardInstance) {
  // Wait for the card to be fully rendered
  setTimeout(() => {
    enhanceSearchInputField(cardElement, entityId, cardInstance);
  }, 100);
}

/**
 * Enhance input field with search functionality
 * @param {HTMLElement} cardElement - Card element
 * @param {string} entityId - Entity ID
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function enhanceSearchInputField(cardElement, entityId, cardInstance) {
  // Find the input element
  let inputElement;
  if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
    inputElement = cardElement.querySelector('.native-todo-card .add-textfield input');
  } else {
    inputElement = cardElement.querySelector('.add-textfield input');
  }

  if (!inputElement) return;

  // Remove existing search handlers if any
  if (cardInstance._searchInputHandlers.has(entityId)) {
    const oldHandlers = cardInstance._searchInputHandlers.get(entityId);
    if (oldHandlers.inputHandler) {
      inputElement.removeEventListener('input', oldHandlers.inputHandler);
    }
  }

  // Create search input handler only
  const inputHandler = (e) => handleSearchInput(e, entityId, cardElement, cardInstance);

  // Add event listener
  inputElement.addEventListener('input', inputHandler);

  // Store handler for cleanup
  cardInstance._searchInputHandlers.set(entityId, {
    inputHandler,
    inputElement
  });

  debugLog(`Search functionality setup for entity: ${entityId}`);
}

/**
 * Handle search input changes
 * @param {Event} e - Input event
 * @param {string} entityId - Entity ID
 * @param {HTMLElement} cardElement - Card element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function handleSearchInput(e, entityId, cardElement, cardInstance) {
  const searchText = e.target.value;
  cardInstance._currentSearchText = searchText;

  // Save search state for this entity
  if (searchText.trim() === '') {
    cardInstance._searchStates.delete(entityId);
  } else {
    cardInstance._searchStates.set(entityId, searchText);
  }

  // Update the card with filtered items
  cardInstance.cardBuilder.updateNativeTodoCard(cardElement, entityId);

  debugLog(`Search input changed for ${entityId}: "${searchText}"`);
}

/**
 * Handle keydown events in search field
 * @param {Event} e - Keydown event
 * @param {string} entityId - Entity ID
 * @param {HTMLElement} cardElement - Card element
 * @param {HTMLElement} inputElement - Input element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function handleSearchKeydown(e, entityId, cardElement, inputElement, cardInstance) {
  debugLog(`Key pressed: ${e.key} for entity: ${entityId}`);

  if (e.key === 'Enter') {
    debugLog(`Enter key detected for ${entityId}`);
    e.preventDefault();
    e.stopPropagation();

    const searchText = inputElement.value.trim();
    debugLog(`Search text to process: "${searchText}"`);

    if (searchText) {
      // CLEAR SEARCH STATE FIRST - before doing anything else
      debugLog(`Clearing search state for ${entityId} BEFORE adding item`);
      cardInstance._searchStates.delete(entityId);
      cardInstance._currentSearchText = '';
      inputElement.value = '';

      debugLog(
        `Search state cleared. Remaining states:`,
        Array.from(cardInstance._searchStates.keys())
      );

      // Check if the search text matches any existing items
      const entityState = cardInstance._hass?.states?.[entityId];
      const items = entityState?.attributes?.items || [];
      const exactMatch = items.some(
        (item) => item.summary.toLowerCase() === searchText.toLowerCase()
      );

      if (!exactMatch) {
        debugLog(`No exact match found, adding item: "${searchText}"`);
        // Add new item since no exact match found
        cardInstance._addTodoItem(entityId, searchText);
      } else {
        debugLog(`Exact match found, not adding item: "${searchText}"`);
      }
    }
  } else if (e.key === 'Escape') {
    debugLog(`Escape key detected for ${entityId}`);
    // Clear search on Escape
    inputElement.value = '';
    cardInstance._currentSearchText = '';
    cardInstance._searchStates.delete(entityId);
    cardInstance.cardBuilder.updateNativeTodoCard(cardElement, entityId);
  }
}

/**
 * Check if item matches search criteria
 * @param {Object} item - Todo item
 * @param {string} searchText - Search text
 * @returns {boolean} True if matches
 */
export function matchesSearch(item, searchText) {
  if (!searchText) return true;

  try {
    const regex = new RegExp(searchText, 'i');
    return regex.test(item.summary) || (item.description && regex.test(item.description));
  } catch (e) {
    // Fallback to simple includes
    const lowerSearch = searchText.toLowerCase();
    return (
      item.summary.toLowerCase().includes(lowerSearch) ||
      (item.description && item.description.toLowerCase().includes(lowerSearch))
    );
  }
}

/**
 * Clean up search event handlers
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function cleanupSearchHandlers(cardInstance) {
  if (cardInstance._searchInputHandlers) {
    cardInstance._searchInputHandlers.forEach((handlers) => {
      if (handlers.inputElement) {
        if (handlers.inputHandler) {
          handlers.inputElement.removeEventListener('input', handlers.inputHandler);
        }
        if (handlers.keydownHandler) {
          handlers.inputElement.removeEventListener('keydown', handlers.keydownHandler);
        }
      }
    });
    cardInstance._searchInputHandlers.clear();
  }

  if (cardInstance._searchStates) {
    cardInstance._searchStates.clear();
  }

  cardInstance._currentSearchText = '';
}
