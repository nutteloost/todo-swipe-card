import { debugLog } from '../utils/Debug.js';

/**
 * Setup drag and drop functionality for todo items
 * Mobile: Uses simple approach (HTML5 drag events only, doesn't work but doesn't interfere)
 * Desktop: Uses press-and-hold activation to avoid conflict with swipe gestures
 * @param {HTMLElement} listContainer - The todo list container
 * @param {string} entityId - Entity ID
 * @param {Array} items - Array of todo items
 * @param {Object} hass - Home Assistant object
 */
export function setupDragAndDrop(listContainer, entityId, items, hass) {
  // CRITICAL: Clean up any existing drag-and-drop handlers first
  cleanupDragAndDrop(listContainer);

  const todoItems = listContainer.querySelectorAll('.todo-item[data-supports-drag="true"]');

  // Track which item is currently showing drop indicator
  let currentDropTarget = null;
  let currentDropPosition = null;

  // Detect if this is a mobile device
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isMobile) {
    // MOBILE: Use original simple approach - just set draggable and add drag events
    // (HTML5 drag/drop doesn't work on mobile, but this approach doesn't interfere with scrolling)
    debugLog(
      'Mobile device detected - using simple drag setup (drag/drop not supported on mobile)'
    );

    todoItems.forEach((itemElement, index) => {
      const item = items[index];
      if (!item) return;

      // Set draggable from the start (original approach)
      itemElement.setAttribute('draggable', 'true');

      // Add only the drag event listeners (won't fire on mobile, but doesn't interfere)
      setupDragEventListeners(
        itemElement,
        item,
        todoItems,
        listContainer,
        currentDropTarget,
        currentDropPosition,
        entityId,
        items,
        hass
      );
    });

    return; // Exit early for mobile
  }

  // DESKTOP: Use press-and-hold activation to avoid swipe gesture conflicts
  debugLog('Desktop device detected - using hold-to-drag setup');

  const HOLD_DURATION = 200; // 0.2 seconds to activate drag
  const MOVE_TOLERANCE = 8; // 8px of movement cancels hold

  todoItems.forEach((itemElement, index) => {
    const item = items[index];
    if (!item) return;

    // Start with dragging DISABLED - requires hold to activate
    itemElement.setAttribute('draggable', 'false');

    // Track hold state for this item
    let holdTimer = null;
    let holdStartX = 0;
    let holdStartY = 0;
    let dragEnabled = false;
    let isDuringHoldPeriod = false;

    // Mouse down - start hold timer
    const handlePointerDown = (e) => {
      // Don't activate on checkbox
      if (e.target.closest('ha-checkbox') || e.target.closest('.todo-checkbox')) {
        return;
      }

      holdStartX = e.clientX;
      holdStartY = e.clientY;
      dragEnabled = false;
      isDuringHoldPeriod = true;

      holdTimer = setTimeout(() => {
        dragEnabled = true;
        isDuringHoldPeriod = false;
        itemElement.setAttribute('draggable', 'true');
        itemElement.classList.add('drag-ready');

        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        debugLog(`✔ Drag ENABLED after hold: ${item.summary}`);
      }, HOLD_DURATION);

      debugLog(`⏱ Hold timer started for: ${item.summary}`);
    };

    // Mouse move - cancel hold if moved too much
    const handlePointerMove = (e) => {
      if (!isDuringHoldPeriod || !holdTimer) return;

      const deltaX = Math.abs(e.clientX - holdStartX);
      const deltaY = Math.abs(e.clientY - holdStartY);

      if (deltaX > MOVE_TOLERANCE || deltaY > MOVE_TOLERANCE) {
        clearTimeout(holdTimer);
        holdTimer = null;
        isDuringHoldPeriod = false;
        debugLog(`✗ Hold CANCELLED - movement detected: ${item.summary}`);
      }
    };

    // Mouse up or leave - cancel hold timer OR reset drag state
    const handlePointerUp = (e) => {
      const isMouseLeave = e.type === 'mouseleave';
      const isMouseUp = e.type === 'mouseup';

      if (isDuringHoldPeriod && holdTimer) {
        if (isMouseLeave) {
          debugLog(`ℹ Ignoring mouseleave during hold period: ${item.summary}`);
          return;
        }

        if (isMouseUp) {
          clearTimeout(holdTimer);
          holdTimer = null;
          isDuringHoldPeriod = false;
          debugLog(`✗ Hold CANCELLED - button released too early: ${item.summary}`);
          return;
        }
      }

      if (itemElement.classList.contains('dragging')) {
        debugLog(`ℹ Drag in progress - ignoring pointer event: ${item.summary}`);
        return;
      }

      if (dragEnabled) {
        if (isMouseLeave) {
          debugLog(`ℹ Ignoring mouseleave - drag is enabled: ${item.summary}`);
          return;
        }

        if (isMouseUp) {
          debugLog(`🧹 Button released without drag - cleaning up: ${item.summary}`);
          itemElement.setAttribute('draggable', 'false');
          itemElement.classList.remove('drag-ready');
          dragEnabled = false;
          isDuringHoldPeriod = false;
          return;
        }
      }

      setTimeout(() => {
        if (!itemElement.classList.contains('dragging') && !dragEnabled) {
          itemElement.setAttribute('draggable', 'false');
          itemElement.classList.remove('drag-ready');
          dragEnabled = false;
          isDuringHoldPeriod = false;
        }
      }, 100);
    };

    // Drag start handler
    const handleDragStart = (e) => {
      if (e.target.closest('ha-checkbox') || e.target.closest('.todo-checkbox')) {
        e.preventDefault();
        return;
      }

      if (!dragEnabled) {
        e.preventDefault();
        debugLog(`✗ Drag PREVENTED - hold not completed: ${item.summary}`);
        return;
      }

      itemElement.classList.add('dragging');
      itemElement.classList.remove('drag-ready');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.uid);

      const dragImage = document.createElement('div');
      dragImage.style.cssText =
        'position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);

      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);

      debugLog(`🎯 Drag STARTED: ${item.summary}`);
    };

    // Drag end handler
    const handleDragEnd = () => {
      itemElement.classList.remove('dragging', 'drag-ready');
      itemElement.setAttribute('draggable', 'false');
      dragEnabled = false;
      isDuringHoldPeriod = false;

      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      currentDropTarget = null;
      currentDropPosition = null;

      debugLog(`✔ Drag ENDED: ${item.summary}`);
    };

    // Store ALL handlers on the element for cleanup
    itemElement._dragHandlers = {
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handleDragStart,
      handleDragEnd
    };

    // Attach all event listeners
    itemElement.addEventListener('mousedown', handlePointerDown);
    itemElement.addEventListener('mousemove', handlePointerMove);
    itemElement.addEventListener('mouseup', handlePointerUp);
    itemElement.addEventListener('mouseleave', handlePointerUp);
    itemElement.addEventListener('dragstart', handleDragStart);
    itemElement.addEventListener('dragend', handleDragEnd);

    // Add dragover and drop listeners
    setupDragOverAndDrop(
      itemElement,
      item,
      todoItems,
      listContainer,
      currentDropTarget,
      currentDropPosition,
      entityId,
      items,
      hass
    );
  });
}

/**
 * Setup drag event listeners (used for both mobile and desktop)
 */
function setupDragEventListeners(
  itemElement,
  item,
  todoItems,
  listContainer,
  currentDropTarget,
  currentDropPosition,
  entityId,
  items,
  hass
) {
  // Drag start (mobile/simple version - no hold check)
  const handleDragStart = (e) => {
    if (e.target.closest('ha-checkbox') || e.target.closest('.todo-checkbox')) {
      e.preventDefault();
      return;
    }

    itemElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.uid);

    const dragImage = document.createElement('div');
    dragImage.style.cssText =
      'position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    debugLog(`Drag started for item: ${item.summary}`);
  };

  // Drag end
  const handleDragEnd = () => {
    itemElement.classList.remove('dragging');
    todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
    debugLog(`Drag ended for item: ${item.summary}`);
  };

  // Store handlers for cleanup
  itemElement._dragHandlers = {
    handleDragStart,
    handleDragEnd
  };

  // Attach listeners
  itemElement.addEventListener('dragstart', handleDragStart);
  itemElement.addEventListener('dragend', handleDragEnd);

  // Dragover and drop
  setupDragOverAndDrop(
    itemElement,
    item,
    todoItems,
    listContainer,
    currentDropTarget,
    currentDropPosition,
    entityId,
    items,
    hass
  );
}

/**
 * Setup dragover and drop listeners (shared between mobile and desktop)
 */
function setupDragOverAndDrop(
  itemElement,
  item,
  todoItems,
  listContainer,
  currentDropTarget,
  currentDropPosition,
  entityId,
  items,
  hass
) {
  // Drag over handler
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const draggingElement = listContainer.querySelector('.dragging');
    if (!draggingElement || draggingElement === itemElement) {
      return;
    }

    const rect = itemElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const newPosition = e.clientY < midpoint ? 'top' : 'bottom';

    todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));

    if (newPosition === 'top') {
      itemElement.classList.add('drag-over-top');
    } else {
      itemElement.classList.add('drag-over-bottom');
    }
  };

  // Drop handler
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const draggingElement = listContainer.querySelector('.dragging');
    if (!draggingElement || draggingElement === itemElement) {
      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      return;
    }

    const draggedUid = e.dataTransfer.getData('text/plain');
    const draggedItem = items.find((item) => item.uid === draggedUid);

    if (!draggedItem) {
      debugLog('Could not find dragged item');
      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      return;
    }

    const rect = itemElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const dropAbove = e.clientY < midpoint;

    let previousUid = null;

    if (dropAbove) {
      const targetIndex = items.findIndex((i) => i.uid === item.uid);
      if (targetIndex > 0) {
        previousUid = items[targetIndex - 1].uid;
      }
    } else {
      previousUid = item.uid;
    }

    const draggedIndex = items.findIndex((i) => i.uid === draggedUid);
    const targetIndex = items.findIndex((i) => i.uid === item.uid);

    if (
      (dropAbove && targetIndex === draggedIndex + 1) ||
      (!dropAbove && targetIndex === draggedIndex - 1)
    ) {
      debugLog('Item already in this position, skipping move');
      todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      return;
    }

    todoItems.forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));

    debugLog(`Moving item "${draggedItem.summary}" to position after "${previousUid || 'start'}"`);

    const { moveItem } = await import('./TodoOperations.js');
    await moveItem(entityId, draggedUid, previousUid, hass);
  };

  // Store handlers for cleanup
  itemElement._dragOverHandler = handleDragOver;
  itemElement._dropHandler = handleDrop;

  // Attach listeners
  itemElement.addEventListener('dragover', handleDragOver);
  itemElement.addEventListener('drop', handleDrop);
}

/**
 * Cleanup drag and drop listeners
 * @param {HTMLElement} listContainer - The todo list container
 */
export function cleanupDragAndDrop(listContainer) {
  if (!listContainer) return;

  const todoItems = listContainer.querySelectorAll('.todo-item');
  todoItems.forEach((item) => {
    // Remove draggable attribute and classes
    item.setAttribute('draggable', 'false');
    item.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom', 'drag-ready');

    // Remove stored event handlers if they exist
    if (item._dragHandlers) {
      const {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleDragStart,
        handleDragEnd
      } = item._dragHandlers;

      if (handlePointerDown) {
        item.removeEventListener('mousedown', handlePointerDown);
      }
      if (handlePointerMove) {
        item.removeEventListener('mousemove', handlePointerMove);
      }
      if (handlePointerUp) {
        item.removeEventListener('mouseup', handlePointerUp);
        item.removeEventListener('mouseleave', handlePointerUp);
      }
      if (handleDragStart) {
        item.removeEventListener('dragstart', handleDragStart);
      }
      if (handleDragEnd) {
        item.removeEventListener('dragend', handleDragEnd);
      }

      // Clear the stored handlers
      delete item._dragHandlers;
    }

    // Also clean up dragover and drop handlers if they were stored
    if (item._dragOverHandler) {
      item.removeEventListener('dragover', item._dragOverHandler);
      delete item._dragOverHandler;
    }

    if (item._dropHandler) {
      item.removeEventListener('drop', item._dropHandler);
      delete item._dropHandler;
    }
  });
}
