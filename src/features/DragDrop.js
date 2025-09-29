import { debugLog } from '../utils/Debug.js';

/**
 * Setup drag and drop functionality for todo items
 * @param {HTMLElement} listContainer - The todo list container
 * @param {string} entityId - Entity ID
 * @param {Array} items - Array of todo items
 * @param {Object} hass - Home Assistant object
 */
export function setupDragAndDrop(listContainer, entityId, items, hass) {
  const todoItems = listContainer.querySelectorAll('.todo-item[data-supports-drag="true"]');

  // Track which item is currently showing drop indicator
  let currentDropTarget = null;
  let currentDropPosition = null;

  todoItems.forEach((itemElement, index) => {
    const item = items[index];
    if (!item) return;

    // Set draggable from the start
    itemElement.setAttribute('draggable', 'true');

    // Drag start
    itemElement.addEventListener('dragstart', (e) => {
      // Prevent drag if starting from checkbox
      if (e.target.closest('ha-checkbox') || e.target.closest('.todo-checkbox')) {
        e.preventDefault();
        return;
      }

      itemElement.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.uid);

      // Hide the default drag ghost image on mobile
      const dragImage = document.createElement('div');
      dragImage.style.cssText =
        'position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);

      // Clean up the drag image element after a moment
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);

      debugLog(`Drag started for item: ${item.summary}`);
    });

    // Drag end
    itemElement.addEventListener('dragend', () => {
      itemElement.classList.remove('dragging');

      // Remove all drop indicators
      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      currentDropTarget = null;
      currentDropPosition = null;

      debugLog(`Drag ended for item: ${item.summary}`);
    });

    // Drag over - this is the key event
    itemElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const draggingElement = listContainer.querySelector('.dragging');
      if (!draggingElement || draggingElement === itemElement) {
        // Clear indicators if dragging over self
        if (currentDropTarget) {
          currentDropTarget.classList.remove('drag-over-top', 'drag-over-bottom');
          currentDropTarget = null;
          currentDropPosition = null;
        }
        return;
      }

      // Determine if we should show indicator above or below
      const rect = itemElement.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const newPosition = e.clientY < midpoint ? 'top' : 'bottom';

      // Only update if target or position changed (prevents flickering)
      if (currentDropTarget !== itemElement || currentDropPosition !== newPosition) {
        // Remove old indicators
        todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));

        // Add new indicator
        if (newPosition === 'top') {
          itemElement.classList.add('drag-over-top');
        } else {
          itemElement.classList.add('drag-over-bottom');
        }

        currentDropTarget = itemElement;
        currentDropPosition = newPosition;
      }
    });

    // Remove dragleave event handler entirely - it causes flickering
    // We'll rely on dragover to update the indicators instead

    // Drop
    itemElement.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const draggingElement = listContainer.querySelector('.dragging');
      if (!draggingElement || draggingElement === itemElement) {
        todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
        currentDropTarget = null;
        currentDropPosition = null;
        return;
      }

      const draggedUid = e.dataTransfer.getData('text/plain');
      const draggedItem = items.find((item) => item.uid === draggedUid);

      if (!draggedItem) {
        debugLog('Could not find dragged item');
        todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
        currentDropTarget = null;
        currentDropPosition = null;
        return;
      }

      // Determine drop position
      const rect = itemElement.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const dropAbove = e.clientY < midpoint;

      // Calculate the previous_uid for the API call
      let previousUid = null;

      if (dropAbove) {
        // Dropping above this item
        const targetIndex = items.findIndex((i) => i.uid === item.uid);
        if (targetIndex > 0) {
          previousUid = items[targetIndex - 1].uid;
        }
      } else {
        // Dropping below this item
        previousUid = item.uid;
      }

      // Don't move if dropping in the same position
      const draggedIndex = items.findIndex((i) => i.uid === draggedUid);
      const targetIndex = items.findIndex((i) => i.uid === item.uid);

      if (dropAbove && targetIndex === draggedIndex + 1) {
        debugLog('Item already in this position, skipping move');
        todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
        currentDropTarget = null;
        currentDropPosition = null;
        return;
      }

      if (!dropAbove && targetIndex === draggedIndex - 1) {
        debugLog('Item already in this position, skipping move');
        todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
        currentDropTarget = null;
        currentDropPosition = null;
        return;
      }

      // Remove indicators
      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      currentDropTarget = null;
      currentDropPosition = null;

      // Call the move function
      debugLog(
        `Moving item "${draggedItem.summary}" to position after "${previousUid || 'start'}"`
      );

      // Import and call moveItem
      const { moveItem } = await import('./TodoOperations.js');
      await moveItem(entityId, draggedUid, previousUid, hass);
    });
  });
}

/**
 * Cleanup drag and drop listeners
 * @param {HTMLElement} listContainer - The todo list container
 */
export function cleanupDragAndDrop(listContainer) {
  if (!listContainer) return;

  const todoItems = listContainer.querySelectorAll('.todo-item');
  todoItems.forEach((item) => {
    item.setAttribute('draggable', 'false');
    item.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');
  });
}
