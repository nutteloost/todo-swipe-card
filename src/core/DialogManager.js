import { debugLog } from '../utils/Debug.js';
import {
  updateTodoItemFromDialog,
  addTodoItemFromDialog,
  deleteTodoItemFromDialog,
  entitySupportsFeature
} from '../features/TodoOperations.js';

/**
 * DialogManager handles all dialog-related functionality for TodoSwipeCard
 * Manages todo item edit, add, and delete dialogs
 */
export class DialogManager {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;
    this.currentDialog = null; // Track current open dialog
    this.dialogOpenTime = 0; // Prevent rapid dialog creation
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
   * Create a custom delete button that looks like ha-button but is fully styleable
   * @param {string} text - Button text
   * @param {string} slot - Button slot
   * @returns {HTMLElement} Custom delete button
   * @private
   */
  _createCustomDeleteButton(text, slot) {
    const button = document.createElement('button');
    button.slot = slot;
    button.textContent = text;
    button.setAttribute('destructive', '');

    // Style it to look like ha-button but with red color
    button.style.cssText = `
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-family: var(--mdc-typography-button-font-family, inherit);
      font-size: var(--mdc-typography-button-font-size, 0.875rem);
      font-weight: var(--mdc-typography-button-font-weight, 500);
      text-transform: uppercase;
      letter-spacing: 0.0892857143em;
      cursor: pointer;
      min-width: 64px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      transition: background-color 0.2s, box-shadow 0.2s;
      outline: none;
    `;

    // Add hover and focus effects
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#d32f2f';
      button.style.boxShadow = '0px 2px 4px rgba(244, 67, 54, 0.3)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#f44336';
      button.style.boxShadow = 'none';
    });

    button.addEventListener('focus', () => {
      button.style.backgroundColor = '#d32f2f';
      button.style.boxShadow = '0px 0px 0px 2px rgba(244, 67, 54, 0.3)';
    });

    button.addEventListener('blur', () => {
      button.style.backgroundColor = '#f44336';
      button.style.boxShadow = 'none';
    });

    return button;
  }

  /**
   * Create a regular button that matches ha-button styling
   * @param {string} text - Button text
   * @param {string} slot - Button slot
   * @returns {HTMLElement} Regular button
   * @private
   */
  _createRegularButton(text, slot) {
    const button = document.createElement('ha-button');
    button.slot = slot;
    button.textContent = text;
    return button;
  }

  /**
   * Edit todo item using a custom HA-style dialog
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   */
  editTodoItem(entityId, item) {
    // Prevent rapid dialog creation (debounce)
    const now = Date.now();
    if (now - this.dialogOpenTime < 300) {
      debugLog('Preventing rapid dialog creation');
      return;
    }
    this.dialogOpenTime = now;

    debugLog(`Edit todo item "${item.summary}" in ${entityId}`);
    this.showTodoItemEditDialog(entityId, item);
  }

  /**
   * Show todo item edit dialog with full HA native features
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item (undefined for new items)
   */
  showTodoItemEditDialog(entityId, item = undefined) {
    // Close any existing dialog first
    this.closeCurrentDialog();

    debugLog(`Opening todo edit dialog for ${item ? 'existing' : 'new'} item`);

    // Create dialog with HA's native styling and accessibility
    const dialog = document.createElement('ha-dialog');
    dialog.heading = item ? 'Edit item' : 'Add Todo Item';
    dialog.open = true;
    dialog.style.setProperty('--mdc-dialog-min-width', 'min(600px, 95vw)');
    dialog.style.setProperty('--mdc-dialog-max-width', 'min(600px, 95vw)');

    // Add accessibility attributes
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.setAttribute('aria-modal', 'true');

    // Track this dialog
    this.currentDialog = dialog;

    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    // Get entity state and features
    const entityState = this._hass?.states?.[entityId];
    const supportsDescription = entityState && entitySupportsFeature(entityState, 64);
    const supportsDueDate =
      entityState &&
      (entitySupportsFeature(entityState, 16) || entitySupportsFeature(entityState, 32));
    const supportsDelete = entityState && entitySupportsFeature(entityState, 2);

    // Debug the feature support
    debugLog(`Entity features for ${entityId}:`, {
      supportedFeatures: entityState?.attributes?.supported_features,
      supportsDescription: supportsDescription,
      supportsDueDate: supportsDueDate,
      supportsDelete: supportsDelete
    });

    // Create summary/checkbox row
    const summaryRow = document.createElement('div');
    summaryRow.style.cssText = 'display: flex; align-items: flex-start; gap: 8px;';

    // Checkbox for completion status (only for existing items)
    let checkbox = null;
    if (item) {
      checkbox = document.createElement('ha-checkbox');
      checkbox.checked = item.status === 'completed';
      checkbox.style.marginTop = '8px';
      summaryRow.appendChild(checkbox);
    }

    // Summary input with validation
    const summaryField = document.createElement('ha-textfield');
    summaryField.label = 'Task name';
    summaryField.value = item?.summary || '';
    summaryField.required = true;
    summaryField.style.flexGrow = '1';
    summaryField.dialogInitialFocus = true;
    summaryField.validationMessage = 'Task name is required';
    summaryRow.appendChild(summaryField);

    content.appendChild(summaryRow);

    // Description field
    let descriptionField = null;
    const showDescription = true; // Always show for now
    if (showDescription) {
      descriptionField = document.createElement('ha-textfield');
      descriptionField.label = 'Description';
      descriptionField.value = item?.description || '';
      descriptionField.setAttribute('type', 'textarea');
      descriptionField.setAttribute('rows', '3');
      descriptionField.style.cssText = `
        width: 100%;
        display: block;
        margin-bottom: 16px;
      `;
      content.appendChild(descriptionField);
      debugLog('Description field (ha-textfield textarea) added to dialog');
    }

    // Due date field (if supported)
    let dateField = null;
    let timeField = null;
    if (supportsDueDate) {
      const dueSection = document.createElement('div');

      // Create the "Due date:" label
      const dueLabel = document.createElement('span');
      dueLabel.className = 'label';
      dueLabel.textContent = 'Due date:';
      dueLabel.style.cssText = `
        font-size: var(--ha-font-size-s, 12px);
        font-weight: var(--ha-font-weight-medium, 500);
        color: var(--input-label-ink-color, var(--primary-text-color));
        display: block;
        margin-bottom: 8px;
      `;
      dueSection.appendChild(dueLabel);

      // Create flex container for date and time inputs
      const flexContainer = document.createElement('div');
      flexContainer.className = 'flex';
      flexContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        gap: 16px;
      `;

      // Parse existing due date
      let dueDate = '';
      let dueTime = '';
      if (item?.due) {
        try {
          const due = new Date(item.due);
          if (!isNaN(due.getTime())) {
            dueDate = due.toISOString().split('T')[0]; // YYYY-MM-DD format
            if (item.due.includes('T')) {
              dueTime = due.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
            }
          }
        } catch (e) {
          debugLog('Error parsing due date:', e);
        }
      }

      // Create date input
      const dateContainer = document.createElement('div');
      dateContainer.style.cssText = `flex-grow: 1; position: relative;`;

      dateField = document.createElement('input');
      dateField.type = 'date';
      dateField.value = dueDate;
      dateField.style.cssText = `
        width: 100%;
        height: 56px;
        padding: 20px 12px 6px 12px;
        border: none;
        border-bottom: 1px solid var(--divider-color);
        border-radius: 0;
        background: transparent;
        color: var(--primary-text-color);
        font-family: var(--mdc-typography-subtitle1-font-family, inherit);
        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
        line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);
        box-sizing: border-box;
        outline: none;
        transition: border-bottom-color 0.15s ease;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: textfield;
      `;

      // Create wrapper
      const dateWrapper = document.createElement('div');
      dateWrapper.style.cssText = `
        position: relative;
        background: var(--mdc-text-field-fill-color, #f5f5f5);
        border-radius: 4px 4px 0 0;
        min-height: 56px;
        display: flex;
        align-items: center;
      `;

      // Create floating label for date field
      const dateLabel = document.createElement('span');
      dateLabel.textContent = 'Due Date';
      dateLabel.style.cssText = `
        position: absolute;
        left: 12px;
        top: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
        pointer-events: none;
        transition: all 0.2s ease;
      `;

      // Add clear functionality
      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.innerHTML = '×';
      clearButton.style.cssText = `
        position: absolute;
        right: 36px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--secondary-text-color);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: ${dueDate ? 'flex' : 'none'};
        align-items: center;
        justify-content: center;
        z-index: 2;
      `;

      clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dateField.value = '';
        clearButton.style.display = 'none';
        if (timeField) {
          timeField.value = '';
        }
      });

      // Show/hide clear button based on input value
      dateField.addEventListener('input', () => {
        clearButton.style.display = dateField.value ? 'flex' : 'none';
      });

      dateWrapper.appendChild(dateLabel);
      dateWrapper.appendChild(dateField);
      dateWrapper.appendChild(clearButton);
      dateContainer.appendChild(dateWrapper);
      flexContainer.appendChild(dateContainer);

      // Create time input if datetime is supported
      if (entitySupportsFeature(entityState, 32)) {
        const timeContainer = document.createElement('div');
        timeContainer.style.cssText = `position: relative; min-width: 120px;`;

        const timeWrapper = document.createElement('div');
        timeWrapper.style.cssText = `
          position: relative;
          background: var(--mdc-text-field-fill-color, #f5f5f5);
          border-radius: 4px 4px 0 0;
          min-height: 56px;
          display: flex;
          align-items: center;
        `;

        timeField = document.createElement('input');
        timeField.type = 'time';
        timeField.value = dueTime;
        timeField.style.cssText = `
          width: 100%;
          height: 56px;
          padding: 20px 12px 6px 12px;
          border: none;
          border-bottom: 1px solid var(--divider-color);
          border-radius: 0;
          background: transparent;
          color: var(--primary-text-color);
          font-family: var(--mdc-typography-subtitle1-font-family, inherit);
          font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
          line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);
          box-sizing: border-box;
          outline: none;
          transition: border-bottom-color 0.15s ease;
          -webkit-appearance: none;
          -moz-appearance: textfield;
        `;

        // Create floating label for time field
        const timeLabel = document.createElement('span');
        timeLabel.textContent = 'Time';
        timeLabel.style.cssText = `
          position: absolute;
          left: 12px;
          top: 8px;
          font-size: 12px;
          color: var(--secondary-text-color);
          pointer-events: none;
          transition: all 0.2s ease;
        `;

        timeWrapper.appendChild(timeLabel);
        timeWrapper.appendChild(timeField);
        timeContainer.appendChild(timeWrapper);
        flexContainer.appendChild(timeContainer);
      }

      dueSection.appendChild(flexContainer);
      content.appendChild(dueSection);

      debugLog('Custom due date section added with native HA textfield styling');
    }

    // Add focus trap for better accessibility
    const setupFocusTrap = () => {
      const focusableElements = dialog.querySelectorAll(
        'ha-textfield, ha-checkbox, input, button, ha-button'
      );
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    };

    // Set up focus trap after dialog is added to DOM
    setTimeout(setupFocusTrap, 100);

    dialog.appendChild(content);

    // Delete button (if item exists and supports delete)
    if (item && supportsDelete) {
      const deleteButton = this._createCustomDeleteButton('Delete item', 'secondaryAction');

      deleteButton.addEventListener('click', async () => {
        const confirmed = await this.showDeleteConfirmationDialog(item.summary);
        if (confirmed) {
          deleteTodoItemFromDialog(entityId, item, this._hass);
          this.closeDialog(dialog);
        }
      });

      dialog.appendChild(deleteButton);
    }

    // Cancel button
    const cancelButton = this._createRegularButton('Cancel', 'primaryAction');
    cancelButton.addEventListener('click', () => {
      this.closeDialog(dialog);
    });
    dialog.appendChild(cancelButton);

    // Save button
    const saveText = item ? 'Save item' : 'Add';
    const saveButton = this._createRegularButton(saveText, 'primaryAction');
    saveButton.addEventListener('click', async () => {
      const summary = summaryField.value.trim();
      if (!summary) {
        summaryField.reportValidity();
        return;
      }

      // Handle due date/time properly
      let dueValue = '';
      if (dateField?.value) {
        if (timeField?.value) {
          // Create a proper Date object and convert to ISO string
          const dateTimeString = `${dateField.value}T${timeField.value}:00`;
          try {
            const dateObj = new Date(dateTimeString);
            dueValue = dateObj.toISOString();
          } catch (e) {
            console.error('Invalid date/time combination');
            dueValue = dateField.value; // fallback to date only
          }
        } else {
          // Date only
          dueValue = dateField.value;
        }
      }

      // Build data object conditionally based on entity support
      const data = {
        summary: summary,
        completed: checkbox?.checked || false
      };

      // Only include description if entity supports it
      if (supportsDescription) {
        data.description = descriptionField?.value;
      }

      // Only include dueDate if entity supports it
      if (supportsDueDate) {
        data.dueDate = dueValue;
      }

      const success = await this.handleDialogSave(entityId, item, data);

      if (success) {
        this.closeDialog(dialog);
      }
    });
    dialog.appendChild(saveButton);

    // Keyboard handlers
    summaryField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const summary = summaryField.value.trim();
        if (summary) {
          // Handle due date/time properly
          let dueValue = '';
          if (dateField?.value) {
            if (timeField?.value) {
              // Create a proper Date object and convert to ISO string
              const dateTimeString = `${dateField.value}T${timeField.value}:00`;
              try {
                const dateObj = new Date(dateTimeString);
                dueValue = dateObj.toISOString();
              } catch (e) {
                console.error('Invalid date/time combination');
                dueValue = dateField.value; // fallback to date only
              }
            } else {
              // Date only
              dueValue = dateField.value;
            }
          }

          // Build data object conditionally based on entity support
          const data = {
            summary: summary,
            completed: checkbox?.checked || false
          };

          // Only include description if entity supports it
          if (supportsDescription) {
            data.description = descriptionField?.value;
          }

          // Only include dueDate if entity supports it
          if (supportsDueDate) {
            data.dueDate = dueValue;
          }

          this.handleDialogSave(entityId, item, data).then((success) => {
            if (success) this.closeDialog(dialog);
          });
        }
      }
    });

    // Handle dialog close
    dialog.addEventListener('closed', () => {
      this.onDialogClosed(dialog);
    });

    // Add to document and focus
    document.body.appendChild(dialog);

    // Focus after dialog is rendered
    setTimeout(() => {
      summaryField.focus();
    }, 100);
  }

  /**
   * Close a specific dialog
   * @param {HTMLElement} dialog - Dialog to close
   */
  closeDialog(dialog) {
    if (dialog && dialog.open) {
      dialog.open = false;
      dialog.close();
    }
  }

  /**
   * Close the current dialog
   */
  closeCurrentDialog() {
    if (this.currentDialog) {
      this.closeDialog(this.currentDialog);
      this.currentDialog = null;
    }
  }

  /**
   * Handle when a dialog is closed
   * @param {HTMLElement} dialog - Closed dialog
   */
  onDialogClosed(dialog) {
    // Clean up the dialog from DOM
    if (dialog.parentNode) {
      dialog.parentNode.removeChild(dialog);
    }

    // Clear current dialog reference if this was the current one
    if (this.currentDialog === dialog) {
      this.currentDialog = null;
    }
  }

  /**
   * Handle saving from the dialog with error handling
   * @param {string} entityId - Entity ID
   * @param {Object} item - Original item (null for new items)
   * @param {Object} data - Form data
   * @returns {Promise<boolean>} Success status
   */
  async handleDialogSave(entityId, item, data) {
    if (!data.summary) {
      return false;
    }

    try {
      if (item) {
        await updateTodoItemFromDialog(entityId, item, data, this._hass);
      } else {
        await addTodoItemFromDialog(entityId, data, this._hass);
      }
      return true;
    } catch (error) {
      debugLog('Error saving todo item:', error);
      return false;
    }
  }

  /**
   * Show delete confirmation dialog
   * @param {string} itemSummary - Item summary for confirmation
   * @returns {Promise<boolean>} True if confirmed
   */
  async showDeleteConfirmationDialog(itemSummary) {
    return new Promise((resolve) => {
      const confirmDialog = document.createElement('ha-dialog');
      confirmDialog.heading = 'Confirm Deletion';
      confirmDialog.open = true;

      const content = document.createElement('div');
      content.style.padding = '16px';
      content.textContent = `Are you sure you want to delete "${itemSummary}"?`;
      confirmDialog.appendChild(content);

      // Cancel button first (secondary action)
      const cancelButton = this._createRegularButton('Cancel', 'secondaryAction');
      cancelButton.addEventListener('click', () => {
        confirmDialog.close();
        resolve(false);
      });

      // Delete button with red styling
      const confirmButton = this._createCustomDeleteButton('Delete', 'primaryAction');
      confirmButton.addEventListener('click', () => {
        confirmDialog.close();
        resolve(true);
      });

      confirmDialog.appendChild(cancelButton);
      confirmDialog.appendChild(confirmButton);

      confirmDialog.addEventListener('closed', () => {
        if (confirmDialog.parentNode) {
          confirmDialog.parentNode.removeChild(confirmDialog);
        }
        resolve(false);
      });

      document.body.appendChild(confirmDialog);
    });
  }

  /**
   * Show delete confirmation dialog for delete completed items
   * @param {string} entityId - Entity ID for the todo list
   */
  showDeleteCompletedConfirmation(entityId) {
    // Create confirmation dialog
    const dialog = document.createElement('ha-dialog');
    dialog.heading = 'Confirm Deletion';
    dialog.open = true;

    // Create content container
    const content = document.createElement('div');
    content.style.padding = '16px';
    content.textContent = 'Are you sure you want to delete all completed items from the list?';
    dialog.appendChild(content);

    // Create cancel button first (secondary action)
    const cancelButton = this._createRegularButton('Cancel', 'secondaryAction');
    cancelButton.addEventListener('click', () => {
      dialog.close();
    });

    // Create confirm button with red styling
    const confirmButton = this._createCustomDeleteButton('Delete', 'primaryAction');
    confirmButton.addEventListener('click', () => {
      dialog.close();
      // Import deleteCompletedItems here to avoid circular dependency
      import('../features/TodoOperations.js').then((module) => {
        module.deleteCompletedItems(entityId, this._hass);
      });
    });

    // Append buttons to dialog
    dialog.appendChild(cancelButton);
    dialog.appendChild(confirmButton);

    // Handle dialog close
    dialog.addEventListener('closed', () => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    });

    // Add dialog to document
    document.body.appendChild(dialog);
  }
}
