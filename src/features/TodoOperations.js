import { debugLog } from '../utils/Debug.js';
import { createDueDateElement } from '../ui/DomHelpers.js';

/**
 * Subscribe to todo items using the exact HA core method
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 * @returns {Promise<Function>} Unsubscribe function
 */
export async function subscribeToTodoItems(entityId, hass) {
  if (!hass?.connection) {
    debugLog(`No hass connection for ${entityId}`);
    return () => {};
  }

  try {
    debugLog(`Subscribing to todo items for ${entityId} using HA core method`);

    // Use the exact method from HA core
    const unsubscribe = hass.connection.subscribeMessage(
      (update) => {
        debugLog(`Received todo update for ${entityId}:`, update);

        // This will be handled by the card instance
        const event = new CustomEvent('todo-items-updated', {
          detail: { entityId, items: update.items || [] },
          bubbles: true,
          composed: true
        });
        document.dispatchEvent(event);
      },
      {
        type: 'todo/item/subscribe',
        entity_id: entityId
      }
    );

    debugLog(`Successfully subscribed to ${entityId}`);
    return unsubscribe;
  } catch (error) {
    debugLog(`Subscription failed for ${entityId}:`, error);
    return () => {};
  }
}

/**
 * Fetch todo items using the exact HA core method
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 * @returns {Promise<Array>} Array of todo items
 */
export async function fetchTodoItems(entityId, hass) {
  if (!hass) return [];

  try {
    debugLog(`Fetching todo items for ${entityId} using HA core method`);

    // Use the exact method from HA core: hass.callWS
    const result = await hass.callWS({
      type: 'todo/item/list',
      entity_id: entityId
    });

    debugLog(`HA core WS result for ${entityId}:`, result);
    return result.items || [];
  } catch (error) {
    debugLog(`HA core WS call failed for ${entityId}:`, error);
    return [];
  }
}

/**
 * Add a new todo item
 * @param {string} entityId - Entity ID
 * @param {string} summary - Item summary
 * @param {Object} hass - Home Assistant object
 */
export function addTodoItem(entityId, summary, hass) {
  if (!hass || !entityId || !summary) return;

  hass.callService('todo', 'add_item', {
    entity_id: entityId,
    item: summary
  });

  debugLog(`Adding todo item "${summary}" to ${entityId}`);
}

/**
 * Toggle todo item completion status
 * @param {string} entityId - Entity ID
 * @param {Object} item - Todo item
 * @param {boolean} completed - New completion status
 * @param {Object} hass - Home Assistant object
 */
export function toggleTodoItem(entityId, item, completed, hass) {
  if (!hass || !entityId || !item) return;

  hass.callService('todo', 'update_item', {
    entity_id: entityId,
    item: item.uid,
    status: completed ? 'completed' : 'needs_action'
  });

  debugLog(`Toggling todo item "${item.summary}" to ${completed ? 'completed' : 'needs_action'}`);
}

/**
 * Update todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} item - Original todo item
 * @param {Object} data - Updated data
 * @param {Object} hass - Home Assistant object
 */
export async function updateTodoItemFromDialog(entityId, item, data, hass) {
  if (!hass) return;

  const serviceData = {
    entity_id: entityId,
    item: item.uid,
    rename: data.summary
  };

  // Add status if checkbox was present
  if (data.completed !== undefined) {
    serviceData.status = data.completed ? 'completed' : 'needs_action';
  }

  // Add description if supported
  if (data.description !== undefined) {
    serviceData.description = data.description || null;
  }

  // Add due date/datetime if supported
  if (data.dueDate !== undefined) {
    if (data.dueDate && data.dueDate.trim() !== '') {
      // Check if it's a datetime (contains T) or just a date
      if (data.dueDate.includes('T')) {
        serviceData.due_datetime = data.dueDate;
      } else {
        serviceData.due_date = data.dueDate;
      }
    } else {
      // Clear the appropriate field based on what the original item had
      if (item.due) {
        if (item.due.includes('T')) {
          // Original was datetime, clear datetime field
          serviceData.due_datetime = null;
        } else {
          // Original was date only, clear date field
          serviceData.due_date = null;
        }
      } else {
        // Fallback: if no original due date, clear date field
        serviceData.due_date = null;
      }
    }
  }

  await hass.callService('todo', 'update_item', serviceData);
  debugLog(`Updated todo item "${item.summary}" to "${data.summary}"`);
}

/**
 * Add new todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} data - Item data
 * @param {Object} hass - Home Assistant object
 */
export async function addTodoItemFromDialog(entityId, data, hass) {
  if (!hass) return;

  const serviceData = {
    entity_id: entityId,
    item: data.summary
  };

  // Add description if provided
  if (data.description) {
    serviceData.description = data.description;
  }

  // Add due date if provided
  if (data.dueDate !== undefined) {
    serviceData.due_date = data.dueDate || null;
  }

  await hass.callService('todo', 'add_item', serviceData);
  debugLog(`Added todo item "${data.summary}"`);
}

/**
 * Delete todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} item - Todo item to delete
 * @param {Object} hass - Home Assistant object
 */
export function deleteTodoItemFromDialog(entityId, item, hass) {
  if (!hass) return;

  hass.callService('todo', 'remove_item', {
    entity_id: entityId,
    item: item.uid
  });

  debugLog(`Deleted todo item "${item.summary}"`);
}

/**
 * Delete completed items from a todo list
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 */
export function deleteCompletedItems(entityId, hass) {
  if (hass) {
    hass.callService('todo', 'remove_completed_items', {
      entity_id: entityId
    });
  }
}

/**
 * Sort todo items based on display order
 * @param {Array} items - Todo items
 * @param {string} sortMode - Sort mode
 * @param {Object} hass - Home Assistant object for locale
 * @returns {Array} Sorted items
 */
export function sortTodoItems(items, sortMode, hass) {
  const sortedItems = [...items];

  // Always separate completed and uncompleted items first
  const completedItems = sortedItems.filter((item) => item.status === 'completed');
  const uncompletedItems = sortedItems.filter((item) => item.status !== 'completed');

  // Sort each group based on the sort mode
  let sortedUncompleted = uncompletedItems;
  let sortedCompleted = completedItems;

  if (sortMode && sortMode !== 'none') {
    const sortFunction = getSortFunction(sortMode, hass);
    sortedUncompleted = uncompletedItems.sort(sortFunction);
    sortedCompleted = completedItems.sort(sortFunction);
  }

  // Return uncompleted items first, then completed items
  return [...sortedUncompleted, ...sortedCompleted];
}

/**
 * Get sort function based on sort mode
 * @param {string} sortMode - Sort mode
 * @param {Object} hass - Home Assistant object for locale
 * @returns {Function} Sort function
 */
function getSortFunction(sortMode, hass) {
  switch (sortMode) {
    case 'alpha_asc':
      return (a, b) => a.summary.localeCompare(b.summary, hass?.locale?.language);
    case 'alpha_desc':
      return (a, b) => b.summary.localeCompare(a.summary, hass?.locale?.language);
    case 'duedate_asc':
      return (a, b) => {
        const aDue = parseDueDateForSort(a.due);
        const bDue = parseDueDateForSort(b.due);
        if (!aDue && !bDue) return 0;
        if (!aDue) return 1;
        if (!bDue) return -1;
        return aDue.getTime() - bDue.getTime();
      };
    case 'duedate_desc':
      return (a, b) => {
        const aDue = parseDueDateForSort(a.due);
        const bDue = parseDueDateForSort(b.due);
        if (!aDue && !bDue) return 0;
        if (!aDue) return 1;
        if (!bDue) return -1;
        return bDue.getTime() - aDue.getTime();
      };
    default:
      return () => 0;
  }
}

/**
 * Parse due date string to Date object for sorting
 * @param {string} due - Due date string
 * @returns {Date|null} Parsed date or null
 */
function parseDueDateForSort(due) {
  if (!due) return null;

  try {
    if (due.includes('T')) {
      return new Date(due);
    } else {
      // Date only, set to end of day
      const date = new Date(`${due}T23:59:59`);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Create todo item element with improved click handling for swipe gestures
 * @param {Object} item - Todo item data
 * @param {string} entityId - Entity ID
 * @param {Function} toggleCallback - Callback for toggle action
 * @param {Function} editCallback - Callback for edit action
 * @param {Object} hass - Home Assistant object (needed for ha-relative-time)
 * @param {Object} entityState - Entity state object (for feature detection)
 * @returns {HTMLElement} Todo item element
 */
export function createTodoItemElement(
  item,
  entityId,
  toggleCallback,
  editCallback,
  hass,
  entityState
) {
  const itemElement = document.createElement('div');
  itemElement.className = `todo-item ${item.status === 'completed' ? 'completed' : ''}`;
  itemElement.dataset.itemUid = item.uid; // Store UID for drag and drop

  // Create checkbox
  const checkbox = document.createElement('ha-checkbox');
  checkbox.className = 'todo-checkbox';
  checkbox.checked = item.status === 'completed';

  // Add checkbox change handler
  checkbox.addEventListener('change', (e) => {
    e.stopPropagation(); // Prevent bubbling to item click
    toggleCallback(entityId, item, e.target.checked);
  });

  itemElement.appendChild(checkbox);

  // Create content container
  const content = document.createElement('div');
  content.className = 'todo-content';

  // Create summary
  const summary = document.createElement('div');
  summary.className = 'todo-summary';
  summary.textContent = item.summary;
  content.appendChild(summary);

  // Add description if present
  if (item.description) {
    const description = document.createElement('div');
    description.className = 'todo-description';
    description.textContent = item.description;
    content.appendChild(description);
  }

  // Add due date if present
  if (item.due) {
    const dueElement = createDueDateElement(item.due);
    // Set hass reference for ha-relative-time to work
    const relativeTime = dueElement.querySelector('ha-relative-time');
    if (relativeTime && hass) {
      relativeTime.hass = hass;
    }
    content.appendChild(dueElement);
  }

  itemElement.appendChild(content);

  // Make entire item draggable if entity supports move feature (no visible handle)
  if (entityState && entitySupportsFeature(entityState, 8)) {
    itemElement.setAttribute('data-supports-drag', 'true');
  }

  // Simplified and more reliable click handler
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let moved = false;

  const handleStart = (e) => {
    // Don't handle clicks on the checkbox or drag handle
    if (
      e.target === checkbox ||
      checkbox.contains(e.target) ||
      e.target.closest('.todo-drag-handle')
    ) {
      return;
    }

    moved = false;
    startTime = Date.now();

    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
  };

  const handleMove = (e) => {
    if (!moved) {
      let currentX, currentY;

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);

      // More lenient movement threshold
      if (deltaX > 10 || deltaY > 10) {
        moved = true;
      }
    }
  };

  const handleEnd = (e) => {
    // Don't handle clicks on the checkbox or drag handle
    if (
      e.target === checkbox ||
      checkbox.contains(e.target) ||
      e.target.closest('.todo-drag-handle')
    ) {
      return;
    }

    const duration = Date.now() - startTime;

    // More lenient conditions for click detection
    if (!moved && duration < 1000) {
      // Small delay to ensure we don't interfere with swipe gestures
      setTimeout(() => {
        editCallback(entityId, item);
      }, 10);
    }
  };

  // Add event listeners
  itemElement.addEventListener('touchstart', handleStart, { passive: true });
  itemElement.addEventListener('touchmove', handleMove, { passive: true });
  itemElement.addEventListener('touchend', handleEnd, { passive: true });
  itemElement.addEventListener('mousedown', handleStart);
  itemElement.addEventListener('mousemove', handleMove);
  itemElement.addEventListener('mouseup', handleEnd);

  // Fallback click handler for better reliability
  itemElement.addEventListener('click', (e) => {
    // Don't handle clicks on the checkbox or drag handle
    if (
      e.target === checkbox ||
      checkbox.contains(e.target) ||
      e.target.closest('.todo-drag-handle')
    ) {
      return;
    }

    // Only handle if the other handlers didn't fire recently
    if (!moved && Date.now() - startTime < 100) {
      e.preventDefault();
      e.stopPropagation();
      editCallback(entityId, item);
    }
  });

  return itemElement;
}

/**
 * Check if entity supports a specific feature
 * @param {Object} entityState - Entity state object
 * @param {number} feature - Feature flag
 * @returns {boolean} True if feature is supported
 */
export function entitySupportsFeature(entityState, feature) {
  const supportedFeatures = entityState.attributes?.supported_features || 0;
  return (supportedFeatures & feature) !== 0;
}

/**
 * Move a todo item to a new position
 * @param {string} entityId - Entity ID
 * @param {string} itemUid - UID of item to move
 * @param {string|null} previousUid - UID of item that should come before it (null for first position)
 * @param {Object} hass - Home Assistant object
 * @returns {Promise<void>}
 */
export async function moveItem(entityId, itemUid, previousUid, hass) {
  if (!hass) {
    debugLog('No hass object available for moveItem');
    return;
  }

  try {
    debugLog(`Moving item ${itemUid} after ${previousUid || 'start'} in ${entityId}`);

    await hass.callWS({
      type: 'todo/item/move',
      entity_id: entityId,
      uid: itemUid,
      previous_uid: previousUid || undefined
    });

    debugLog(`Successfully moved item ${itemUid}`);
  } catch (error) {
    console.error('Error moving todo item:', error);
    debugLog(`Failed to move item: ${error.message}`);
  }
}
