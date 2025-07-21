import { LitElement, html, css } from './Dependencies.js';
import { debugLog } from '../utils/Debug.js';
import { editorStyles } from '../ui/Styles.js';
import { VERSION, TodoSortMode } from '../utils/Constants.js';

/**
 * Updated TodoSwipeCardEditor with compact layout similar to simple-swipe-card
 */
export class TodoSwipeCardEditor extends (LitElement || HTMLElement) {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _expandedEntities: { type: Set, state: true }, // Track which entities are expanded
      _buttonFeedbackState: { type: String, state: true } // Track button feedback state
    };
  }

  constructor() {
    super();
    this._expandedEntities = new Set();
    this._buttonFeedbackState = 'normal'; // Can be 'normal', 'blocked', or 'success'

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

    while (!customElements.get('ha-entity-picker') && attempts < maxAttempts) {
      await this._loadCustomElements();
      if (!customElements.get('ha-entity-picker')) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    if (!customElements.get('ha-entity-picker')) {
      console.error('Failed to load ha-entity-picker after multiple attempts');
    }
  }

  async _loadCustomElements() {
    if (!customElements.get('ha-entity-picker')) {
      try {
        const attempts = [
          () => customElements.get('hui-entities-card')?.getConfigElement?.(),
          () => customElements.get('hui-entity-picker-card')?.getConfigElement?.()
        ];

        for (const attempt of attempts) {
          try {
            await attempt();
            if (customElements.get('ha-entity-picker')) {
              break;
            }
          } catch (e) {
            console.debug('Entity picker load attempt failed:', e);
          }
        }
      } catch (e) {
        console.warn('Could not load ha-entity-picker', e);
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
      enable_search: config.enable_search
    };

    // Add other properties, but exclude empty custom_card_mod
    const excludedKeys = [
      'type',
      'entities',
      'card_spacing',
      'show_pagination',
      'show_create',
      'show_addbutton',
      'show_completed',
      'show_completed_menu',
      'delete_confirmation',
      'enable_search',
      'custom_card_mod'
    ];

    Object.entries(config).forEach(([key, value]) => {
      if (!excludedKeys.includes(key)) {
        orderedConfig[key] = value;
      }
    });

    // Only include custom_card_mod if it exists and has meaningful content
    if (
      config.custom_card_mod &&
      typeof config.custom_card_mod === 'object' &&
      Object.keys(config.custom_card_mod).length > 0
    ) {
      orderedConfig.custom_card_mod = config.custom_card_mod;
    }

    return orderedConfig;
  }

  setConfig(config) {
    debugLog('Editor setConfig called with:', JSON.stringify(config));

    this._config = {
      ...this.constructor.getStubConfig()
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
      entities = entities.map((entity) => {
        if (typeof entity === 'string') {
          // Keep string format during editing for backward compatibility
          return entity;
        }
        return entity; // Already object format
      });

      // Only filter out empty entities if they're not at the end of the array
      // This allows newly added empty entities to persist for user configuration
      const hasTrailingEmpty =
        entities.length > 0 &&
        (entities[entities.length - 1] === '' ||
          (typeof entities[entities.length - 1] === 'object' &&
            entities[entities.length - 1].entity === ''));
      if (!hasTrailingEmpty) {
        entities = entities.filter((e) => {
          if (typeof e === 'string') {
            return e && e.trim() !== '';
          }
          return e && e.entity && e.entity.trim() !== '';
        });
      } else {
        // Filter out empty entities except the last one
        const nonEmptyEntities = entities.slice(0, -1).filter((e) => {
          if (typeof e === 'string') {
            return e && e.trim() !== '';
          }
          return e && e.entity && e.entity.trim() !== '';
        });
        entities = [...nonEmptyEntities, ''];
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

      // Only include custom_card_mod if it exists and has content
      const configUpdate = {
        ...this._config,
        ...config,
        entities,
        card_spacing: cardSpacing
      };

      // Only add custom_card_mod if it exists in the original config and has meaningful content
      if (
        config.custom_card_mod &&
        typeof config.custom_card_mod === 'object' &&
        Object.keys(config.custom_card_mod).length > 0
      ) {
        configUpdate.custom_card_mod = config.custom_card_mod;
      }

      this._config = configUpdate;
    }

    debugLog('TodoSwipeCardEditor - Config after initialization:', JSON.stringify(this._config));
    this.requestUpdate();
  }

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
      enable_search: false
    };
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

  get _show_icons() {
    return this._config.show_icons === true;
  }

  get _enable_search() {
    return this._config.enable_search === true;
  }

  get _card_spacing() {
    return this._config.card_spacing !== undefined ? this._config.card_spacing : 15;
  }

  get _validEntities() {
    return (this._config.entities || []).filter((entity) => {
      const entityId = this._getEntityId(entity);
      return entityId && entityId.trim() !== '';
    });
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
      ${editorStyles()}
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
    setTimeout(
      () => {
        this._buttonFeedbackState = 'normal';
        this.requestUpdate();
      },
      state === 'blocked' ? 1000 : 500
    ); // Blocked state lasts longer for better visibility
  }

  _getAvailableEntities(currentIndex = -1) {
    if (!this.hass) return [];

    // Get all todo domain entities
    const allTodoEntities = Object.keys(this.hass.states).filter(
      (entityId) => entityId.startsWith('todo.') && this.hass.states[entityId]
    );

    // Get currently selected entities (excluding the current index being edited)
    const selectedEntities = (this._config.entities || [])
      .map((entity, index) => {
        if (index === currentIndex) return null;
        return this._getEntityId(entity);
      })
      .filter((entityId) => entityId && entityId.trim() !== '');

    // Return entities that are not already selected
    return allTodoEntities.filter((entityId) => !selectedEntities.includes(entityId));
  }

  _getEntityDescriptor(entity) {
    const entityId = this._getEntityId(entity);

    if (!entityId || entityId.trim() === '') {
      return { displayName: 'Empty Entity', friendlyName: '' };
    }

    const entityState = this.hass?.states?.[entityId];
    const friendlyName =
      entityState?.attributes?.friendly_name || entityId.split('.').pop().replace(/_/g, ' ');
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
    console.log('[TodoSwipeCard] _addEntity method called');

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!this._config) {
      console.log('[TodoSwipeCard] No config available');
      return;
    }

    // Check if there's already an empty entity at the end - prevent multiple empty entries
    const currentEntities = Array.isArray(this._config.entities) ? [...this._config.entities] : [];
    const hasTrailingEmpty =
      currentEntities.length > 0 &&
      (currentEntities[currentEntities.length - 1] === '' ||
        (typeof currentEntities[currentEntities.length - 1] === 'object' &&
          currentEntities[currentEntities.length - 1].entity === ''));

    if (hasTrailingEmpty) {
      console.log('[TodoSwipeCard] Already has trailing empty entity, skipping add');

      // Trigger visual feedback for blocked action
      this._triggerButtonFeedback('blocked');
      return;
    }

    // Add new empty entity - use object format for new entities
    currentEntities.push({ entity: '' });

    const newConfig = {
      ...this._config,
      entities: currentEntities
    };

    // Update internal state
    this._config = newConfig;

    debugLog('Adding new entity', newConfig);

    // Trigger visual feedback for successful action
    this._triggerButtonFeedback('success');

    // Dispatch the event immediately
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true
      })
    );

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
    this._expandedEntities.forEach((expandedIndex) => {
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

    const newValue = ev.detail?.value || ev.target.value || '';
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

    const newValue = ev.target.value || '';
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

    const titleText = ev.target.value || '';
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

  _entityIconChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const iconName = ev.target.value || '';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (iconName) {
        entityConfig.icon = iconName;
      }
      entities[index] = entityConfig;
    } else {
      if (iconName) {
        entities[index] = { ...currentEntity, icon: iconName };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.icon;
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
      background_image: entity?.background_image || '',
      icon: entity?.icon || ''
    };
  }

  _getSortModeOptions() {
    return [
      { value: TodoSortMode.NONE, label: 'Default' },
      { value: TodoSortMode.ALPHA_ASC, label: 'Alphabetical A-Z' },
      { value: TodoSortMode.ALPHA_DESC, label: 'Alphabetical Z-A' },
      { value: TodoSortMode.DUEDATE_ASC, label: 'Due Date (Earliest First)' },
      { value: TodoSortMode.DUEDATE_DESC, label: 'Due Date (Latest First)' }
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
    debugLog('Rendering editor with config:', JSON.stringify(this._config));
    debugLog('Current entities:', entities);

    return html`
      <div class="card-config">
        <!-- Todo Lists Section -->
        <div class="section">
          <div class="section-header">Todo Lists</div>

          <div class="card-list">
            ${entities.length === 0
              ? html`<div class="no-cards">
                  No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.
                </div>`
              : entities.map((entity, index) => {
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
                      aria-label="Todo list ${index +
                      1}: ${descriptor.displayName}. Click to ${isExpanded ? 'collapse' : 'expand'}"
                      @keydown=${(e) => this._handleRowKeydown(e, index)}
                    >
                      <div class="card-info">
                        <ha-icon-button
                          class="expand-button leading"
                          label=${isExpanded ? 'Collapse' : 'Expand'}
                          path=${isExpanded
                            ? 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'
                            : 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'}
                          @click=${(e) => this._handleExpandClick(e, index)}
                        ></ha-icon-button>
                        <span class="card-index">${index + 1}</span>
                        <span class="card-type">${descriptor.displayName}</span>
                        ${entityConfig.entity && entityConfig.entity.trim() !== ''
                          ? html`<span class="card-name">(${entityConfig.entity})</span>`
                          : html`<span class="card-name" style="color: var(--error-color);"
                              >(Not configured)</span
                            >`}
                      </div>
                      <div class="card-actions" @click=${this._stopPropagation}>
                        <ha-icon-button
                          label="Move Up"
                          ?disabled=${index === 0}
                          path="M7,15L12,10L17,15H7Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._moveEntity(index, -1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Move Down"
                          ?disabled=${index === entities.length - 1}
                          path="M7,9L12,14L17,9H7Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._moveEntity(index, 1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Delete Todo List"
                          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._removeEntity(index))}
                          style="color: var(--error-color);"
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${isExpanded
                      ? html`
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

                            ${entityConfig.entity && entityConfig.entity.trim() !== ''
                              ? html`
                                  <div
                                    style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;"
                                  >
                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">Show Title</div>
                                      <ha-switch
                                        .checked=${entityConfig.show_title}
                                        data-index=${index}
                                        @change=${this._entityTitleEnabledChanged}
                                      ></ha-switch>
                                    </div>

                                    ${entityConfig.show_title
                                      ? html`
                                          <ha-textfield
                                            label="Title Text"
                                            .value=${entityConfig.title}
                                            data-index=${index}
                                            @input=${this._entityTitleTextChanged}
                                            style="width: 100%; margin-top: 8px;"
                                          ></ha-textfield>
                                        `
                                      : ''}
                                  </div>

                                  <ha-select
                                    .label=${'Display Order'}
                                    .value=${entityConfig.display_order}
                                    data-index=${index}
                                    @selected=${this._entityDisplayOrderChanged}
                                    @closed=${this._stopPropagation}
                                    style="margin-bottom: 4px;"
                                  >
                                    ${this._getSortModeOptions().map(
                                      (option) => html`
                                        <mwc-list-item .value=${option.value}>
                                          ${option.label}
                                        </mwc-list-item>
                                      `
                                    )}
                                  </ha-select>

                                  <ha-textfield
                                    label="Background Image URL"
                                    .value=${entityConfig.background_image}
                                    data-index=${index}
                                    @input=${this._entityBackgroundImageChanged}
                                    style="width: 100%; margin-top: 4px;"
                                    placeholder="Optional: e.g. /local/images/background.jpg"
                                  ></ha-textfield>

                                  ${this._show_icons
                                    ? html`
                                        <ha-textfield
                                          label="Custom Icon"
                                          .value=${entityConfig.icon}
                                          data-index=${index}
                                          @input=${this._entityIconChanged}
                                          style="width: 100%; margin-top: 8px;"
                                          placeholder="Optional: e.g. mdi:cart-variant"
                                        ></ha-textfield>
                                      `
                                    : ''}
                                `
                              : ''}
                          </div>
                        `
                      : ''}
                  `;
                })}
          </div>

          <div class="add-entity-button">
            <button
              class="add-todo-button ${this._buttonFeedbackState !== 'normal'
                ? this._buttonFeedbackState
                : ''}"
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
        <div class="section">
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
            <div class="spacing-help-text">Visual gap between cards when swiping (in pixels)</div>
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
            <div class="toggle-option-label">Show icons</div>
            <ha-switch
              .checked=${this._show_icons}
              data-config-value="show_icons"
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

          ${this._show_create
            ? html`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show '+' add button next to field</div>
                    <ha-switch
                      .checked=${this._show_addbutton}
                      data-config-value="show_addbutton"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>

                  <div class="toggle-option">
                    <div class="toggle-option-label">Enable search functionality</div>
                    <ha-switch
                      .checked=${this._enable_search}
                      data-config-value="enable_search"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>
                </div>
              `
            : ''}

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this._show_completed}
              data-config-value="show_completed"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          ${this._show_completed
            ? html`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show 'Delete completed' button</div>
                    <ha-switch
                      .checked=${this._show_completed_menu}
                      data-config-value="show_completed_menu"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>

                  ${this._show_completed_menu
                    ? html`
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
                      `
                    : ''}
                </div>
              `
            : ''}
        </div>

        <!-- Version Display with GitHub Link -->
        <div class="version-display">
          <div class="version-text">Todo Swipe Card</div>
          <div class="version-badges">
            <div class="version-badge">v${VERSION}</div>
            <a
              href="https://github.com/nutteloost/todo-swipe-card"
              target="_blank"
              rel="noopener noreferrer"
              class="github-badge"
            >
              <ha-icon icon="mdi:github"></ha-icon>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
