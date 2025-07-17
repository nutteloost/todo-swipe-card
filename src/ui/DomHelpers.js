import { debugLog } from '../utils/Debug.js';

/**
 * Build preview state
 * @param {DocumentFragment} fragment - Document fragment to append to
 */
export function buildPreview(fragment) {
  debugLog('Building preview state');
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
  description.textContent =
    'A specialized swipe card for todo lists with native styling. Supports multiple lists with swipe navigation.';

  textContainer.appendChild(title);
  textContainer.appendChild(description);

  // Button
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'preview-actions';
  const editButton = document.createElement('ha-button');
  editButton.raised = true;
  editButton.textContent = 'EDIT CARD';
  editButton.setAttribute('aria-label', 'Edit Card');
  editButton.addEventListener('click', (e) => {
    e.stopPropagation();
    debugLog('Edit button clicked, firing show-edit-card event');
    const event = new CustomEvent('show-edit-card', {
      detail: { element: e.target.closest('todo-swipe-card') },
      bubbles: true,
      composed: true
    });
    e.target.dispatchEvent(event);
  });
  actionsContainer.appendChild(editButton);

  // Append all elements
  previewContainer.appendChild(iconContainer);
  previewContainer.appendChild(textContainer);
  previewContainer.appendChild(actionsContainer);

  fragment.appendChild(previewContainer);
}

/**
 * Create a wrapper around the card with title
 * @param {HTMLElement} cardElement - The card element
 * @param {string} titleText - The title text
 * @returns {HTMLElement} Wrapper element containing title and card
 */
export function createCardWithTitle(cardElement, titleText) {
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'todo-card-with-title-wrapper';

  // Create title
  const titleElement = document.createElement('div');
  titleElement.className = 'todo-swipe-card-external-title';
  titleElement.textContent = titleText;

  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'todo-card-container';

  // Assemble
  wrapper.appendChild(titleElement);
  cardContainer.appendChild(cardElement);
  wrapper.appendChild(cardContainer);

  return wrapper;
}

/**
 * Create an icon element for the slide
 * @param {string|Object} entityConfig - Entity configuration
 * @param {string} entityId - Entity ID
 * @param {Object} hass - Home Assistant object
 * @returns {HTMLElement} Icon element
 */
export function createIconElement(entityConfig, entityId, hass) {
  // Determine which icon to use
  let iconName = 'mdi:format-list-checks'; // Default fallback icon

  // Check for custom icon in entity config
  if (typeof entityConfig === 'object' && entityConfig.icon) {
    iconName = entityConfig.icon;
  } else if (hass && hass.states[entityId]) {
    // Use entity's default icon if available
    const entityIcon = hass.states[entityId].attributes.icon;
    if (entityIcon) {
      iconName = entityIcon;
    }
  }

  // Create icon element
  const iconElement = document.createElement('ha-icon');
  iconElement.className = 'todo-icon';
  iconElement.icon = iconName;

  return iconElement;
}

/**
 * Create due date element with live updates
 * @param {string} due - Due date string
 * @returns {HTMLElement} Due date element
 */
export function createDueDateElement(due) {
  const dueElement = document.createElement('div');
  const dueDate = parseDueDate(due);
  const now = new Date();
  const isOverdue = dueDate && dueDate < now;

  dueElement.className = `todo-due ${isOverdue ? 'overdue' : ''}`;

  // Create clock icon using ha-svg-icon (like the official card)
  const icon = document.createElement('ha-svg-icon');
  icon.className = 'todo-due-icon';
  icon.path =
    'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z';
  dueElement.appendChild(icon);

  // Create date text
  if (dueDate) {
    const isDateOnly = !due.includes('T');
    const isToday = isDateOnly && isSameDay(new Date(), dueDate);

    if (isToday) {
      // For "today", use plain text since it doesn't need live updates
      const dateText = document.createElement('span');
      dateText.textContent = 'Today';
      dueElement.appendChild(dateText);
    } else {
      // Check if it's a short interval (less than 1 hour)
      const timeDiff = Math.abs(dueDate.getTime() - now.getTime());
      const oneHour = 60 * 60 * 1000;

      if (timeDiff < oneHour) {
        // Use custom live updater for short intervals
        const dateText = document.createElement('span');
        dueElement.appendChild(dateText);

        // Update function
        const updateTime = () => {
          const currentTime = new Date();
          const diffMs = dueDate.getTime() - currentTime.getTime();

          // Update overdue class
          const isCurrentlyOverdue = diffMs < 0;
          dueElement.classList.toggle('overdue', isCurrentlyOverdue);

          // Format the time
          if (Math.abs(diffMs) < 60000) {
            // Less than 1 minute - show seconds
            const seconds = Math.round(Math.abs(diffMs) / 1000);
            if (seconds < 5) {
              dateText.textContent = 'now';
            } else if (diffMs < 0) {
              dateText.textContent = `${seconds} seconds ago`;
            } else {
              dateText.textContent = `in ${seconds} seconds`;
            }
          } else {
            // More than 1 minute - show minutes
            const minutes = Math.round(Math.abs(diffMs) / 60000);
            if (diffMs < 0) {
              dateText.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else {
              dateText.textContent = `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
          }
        };

        // Initial update
        updateTime();

        // Set up interval for live updates
        const interval = setInterval(updateTime, 1000); // Update every second

        // Clean up interval when element is removed
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.removedNodes.forEach((node) => {
                if (node === dueElement || node.contains?.(dueElement)) {
                  clearInterval(interval);
                  observer.disconnect();
                }
              });
            }
          });
        });

        // Start observing
        if (dueElement.parentNode) {
          observer.observe(dueElement.parentNode, { childList: true, subtree: true });
        }
      } else {
        // For longer intervals, use ha-relative-time
        const relativeTime = document.createElement('ha-relative-time');
        relativeTime.setAttribute('capitalize', '');
        relativeTime.datetime = dueDate;
        dueElement.appendChild(relativeTime);
      }
    }
  } else {
    // Fallback to raw string if parsing failed
    const dateText = document.createElement('span');
    dateText.textContent = due;
    dueElement.appendChild(dateText);
  }

  return dueElement;
}

/**
 * Parse due date string to Date object (following HA's logic)
 * @param {string} due - Due date string
 * @returns {Date|null} Parsed date or null
 */
export function parseDueDate(due) {
  if (!due) return null;

  try {
    if (due.includes('T')) {
      // DateTime - use exact time
      return new Date(due);
    } else {
      // Date only - set to end of day (like HA does)
      const date = new Date(`${due}T00:00:00`);
      // Set to end of day for proper "today" comparison
      date.setHours(23, 59, 59, 999);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format relative time for due dates (enhanced for better granularity)
 * @param {Date} date - Date to format
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Handle very precise timing (like HA does)
  if (Math.abs(diffMs) < 30000) {
    // Less than 30 seconds
    return 'now';
  } else if (Math.abs(diffMs) < 60000) {
    // Less than 1 minute
    const seconds = Math.round(Math.abs(diffMs) / 1000);
    if (diffMs < 0) {
      return `${seconds} seconds ago`;
    } else {
      return `in ${seconds} seconds`;
    }
  } else if (Math.abs(diffMinutes) < 60) {
    // Less than 1 hour
    if (diffMinutes < 0) {
      return `${Math.abs(diffMinutes)} minutes ago`;
    } else {
      return `in ${diffMinutes} minutes`;
    }
  } else if (Math.abs(diffHours) < 24) {
    // Less than 1 day
    if (diffHours < 0) {
      return `${Math.abs(diffHours)} hours ago`;
    } else {
      return `in ${diffHours} hours`;
    }
  } else {
    // Fall back to day-based relative time
    if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays > 0) {
      return `in ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  }
}
