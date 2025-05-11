/**
 * Todo Swipe Card
 * 
 * A specialized swipe card for todo lists in Home Assistant
 * Allows users to swipe between multiple todo lists with customized styling
 * 
 * Requires card-mod to be installed: https://github.com/thomasloven/lovelace-card-mod
 * 
 * @author Martijn Oost (nutteloost)
 * @version 1.5.1
 * @license MIT
 * @see {@link https://github.com/nutteloost/todo-swipe-card}
 * 
 * Installation:
 * 1. Install HACS: https://hacs.xyz
 * 2. Add this repo as a custom repository in HACS: https://github.com/nutteloost/todo-swipe-card
 * 3. Install the card via HACS
 * 4. Add the card to your dashboard
 */

import { LitElement, html, css } from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

// Configurable debug mode - set to false for production
const DEBUG = false;

/**
 * Log debug messages when debug mode is enabled
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
const debugLog = (message, data) => {
  if (!DEBUG) return;
  console.log(`[TodoSwipeCard] ${message}`, data !== undefined ? data : '');
};

/**
 * TodoSwipeCard: A custom card for Home Assistant to display multiple todo lists with swipe navigation
 * @extends HTMLElement
 */
class TodoSwipeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this.cards = [];
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    this.initialized = false;
    this.building = false;
  }

  /**
   * Returns default configuration for the card
   * @returns {Object} Default configuration
   */
  static getStubConfig() {
    return {
      show_pagination: true,
      show_addbutton: false,
      show_navigation_buttons: false,
      show_create: true,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false,
      card_spacing: 15       // Default spacing in pixels
    };
  }
  
  /**
   * Returns the editor element for the card
   * @returns {HTMLElement} Card editor element
   */
  static getConfigElement() {
    return document.createElement("todo-swipe-card-editor");
  }

  /**
   * Handle edit button click in preview mode
   * @param {Event} e - Click event
   * @private
   */
  _handleEditClick(e) {
    e.stopPropagation();
    debugLog("Edit button clicked, firing show-edit-card event");
    const event = new CustomEvent('show-edit-card', {
      detail: { element: this },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Check if there are valid entities configured
   * @returns {boolean} True if valid entities are present
   * @private
   */
  _hasValidEntities() {
    return this._config && 
           this._config.entities && 
           Array.isArray(this._config.entities) && 
           this._config.entities.length > 0 &&
           this._config.entities.some(entity => entity && entity.trim() !== "");
  }

  /**
   * Set card configuration
   * @param {Object} config - Card configuration
   */
  setConfig(config) {
    debugLog("setConfig called with:", JSON.stringify(config));
    
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
    
    // Clean up entities (remove empty values)
    entities = entities.filter(e => e && e.trim() !== "");

    // Set defaults and merge config
    this._config = {
      ...TodoSwipeCard.getStubConfig(),
      ...config,
      entities // Override with our sanitized entities array
    };

    // Ensure card_spacing is a valid number
    if (this._config.card_spacing === undefined) {
      this._config.card_spacing = 15; // Default spacing
    } else {
      this._config.card_spacing = parseInt(this._config.card_spacing);
      if (isNaN(this._config.card_spacing) || this._config.card_spacing < 0) {
        this._config.card_spacing = 15;
      }
    }

    // Ensure background_images is an object
    if (!this._config.background_images || typeof this._config.background_images !== 'object') {
      this._config.background_images = {};
    }

    debugLog("Config after processing:", JSON.stringify(this._config));

    // If already initialized, rebuild if config changes
    if (this.initialized) {
      debugLog("Rebuilding TodoSwipeCard due to config change");
      this._build();
    }
  }

  /**
   * Set the hass object and update all child cards
   * @param {Object} hass - Home Assistant object
   */
  set hass(hass) {
    if (!hass) return;
    
    this._hass = hass;
    
    // Pass hass to child cards
    if (this.cards) {
      this.cards.forEach(card => {
        if (card.element && card.element.hass !== hass) {
          try {
            card.element.hass = hass;
          } catch (e) {
            console.error("Error setting hass on child card:", e);
          }
        }
      });
    }
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback() {
    if (!this.initialized) {
      debugLog("TodoSwipeCard connecting and building");
      this._build();
    }
  }

  /**
   * Called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    debugLog("TodoSwipeCard disconnecting");
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Clear menu button removal interval
    if (this._menuCheckInterval) {
      clearInterval(this._menuCheckInterval);
      this._menuCheckInterval = null;
    }
    
    this.initialized = false;
    this.cards = [];
    this.shadowRoot.innerHTML = '';
  }

  /**
   * Build the card UI
   * @private
   */
  async _build() {
    // Prevent concurrent builds
    if (this.building) {
      debugLog("Build skipped (already building)");
      return;
    }
    
    this.building = true;
    debugLog("Starting build...");

    const root = this.shadowRoot;
    root.innerHTML = ''; // Clear previous content

    // Add base styles
    const style = document.createElement('style');

    style.textContent = `
      :host {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .card-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
      }

      .slider {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-out;
        will-change: transform;
      }

      .slide {
        position: relative;
        flex: 0 0 100%;
        max-width: 100%;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;
        background: var(--ha-card-background, var(--card-background-color, white));
      }

      .pagination {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        z-index: 1;
      }

      .pagination-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 4px;
        background-color: rgba(127, 127, 127, 0.6);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .pagination-dot.active {
        background-color: var(--primary-color, #03a9f4);
      }
      
      .delete-completed-button {
        position: absolute;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 35px;
        padding: 4px;
        background-color: transparent;
        border: none;
        color: var(--primary-text-color);
        cursor: pointer;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        z-index: 10;
      }
      
      .delete-completed-button:hover {
        background-color: rgba(127, 127, 127, 0.2);
      }
      
      .delete-completed-button svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      /* Global style to ensure all three-dots menus are hidden */
      ::shadow ha-button-menu,
      ::part(ha-button-menu),
      ha-button-menu,
      .header ha-button-menu,
      [id*="menu"],
      [class*="menu-button"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* Preview styles */
      .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: inherit;
      }
      
      .preview-icon-container {
        margin-bottom: 16px;
      }
      
      .preview-icon-container ha-icon {
        color: var(--primary-color, #03a9f4);
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
      
      .preview-text-container {
        margin-bottom: 16px;
      }
      
      .preview-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: var(--primary-text-color);
      }
      
      .preview-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        max-width: 300px;
        line-height: 1.4;
        margin: 0 auto;
      }
      
      /* Dialog styles */
      ha-dialog {
        --mdc-dialog-min-width: 300px;
        --mdc-dialog-max-width: 500px;
        --mdc-dialog-heading-ink-color: var(--primary-text-color);
        --mdc-dialog-content-ink-color: var(--primary-text-color);
        --justify-action-buttons: space-between;
      }
      
      ha-dialog div {
        padding: 8px 16px 16px 16px;
        color: var(--primary-text-color);
      }
    `;
    
    root.appendChild(style);

    // Check if we should show the preview (no valid entities configured)
    if (!this._hasValidEntities()) {
      // Show preview state using the modern styled preview from gemini version
      debugLog("Building preview state");
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
      description.textContent = 'A specialized swipe card for todo lists with built-in styling. Supports multiple lists with swipe navigation.';
      
      textContainer.appendChild(title);
      textContainer.appendChild(description);
      
      // Button
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'preview-actions';
      const editButton = document.createElement('ha-button');
      editButton.raised = true;
      editButton.textContent = 'EDIT CARD';
      editButton.setAttribute('aria-label', 'Edit Card');
      editButton.addEventListener('click', this._handleEditClick.bind(this));
      actionsContainer.appendChild(editButton);
      
      // Append all elements
      previewContainer.appendChild(iconContainer);
      previewContainer.appendChild(textContainer);
      previewContainer.appendChild(actionsContainer);
      
      root.appendChild(previewContainer);
      
      this.initialized = true;
      this.building = false;
      debugLog("Preview build completed");
      return;
    }

    // Regular card layout - only proceed if we have valid entities
    debugLog("Building regular card layout");
    
    // Create container
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-container';

    // Create slider
    this.sliderElement = document.createElement('div');
    this.sliderElement.className = 'slider';
    this.cardContainer.appendChild(this.sliderElement);

    // Load card helpers
    const helpers = await window.loadCardHelpers();
    if (!helpers) {
        console.error("TodoSwipeCard: Card helpers not loaded");
        root.innerHTML = `<ha-alert alert-type="error">Card Helpers are required for this card to function.</ha-alert>`;
        this.building = false;
        this.initialized = false;
        return;
    }
    this.cards = [];

    // Create slides for each todo entity
    const cardPromises = this._config.entities.map(async (entityId, i) => {
      if (!entityId || entityId.trim() === "") {
        debugLog("Skipping empty entity at index", i);
        return null;
      }

      debugLog("Creating card for entity:", entityId);
      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';

      try {
        // Generate entity-specific class name for styling
        const entityName = entityId.split('.').pop().replace(/_/g, '-');
        
        // Get background image if configured
        const backgroundImage = this._config.background_images && 
                            this._config.background_images[entityId] ? 
                            this._config.background_images[entityId] : null;
        
        // Determine if Add button should be shown or hidden
        const showAddButton = this._config.show_addbutton !== undefined ? 
                              this._config.show_addbutton : false;

        // Determine if completed menu should be shown or hidden
        const showCompletedMenu = this._config.show_completed_menu !== undefined ?
                                  this._config.show_completed_menu : false;
        
        // Create the todo-list card with card-mod styling
        const cardConfig = {
          type: 'todo-list',
          entity: entityId,
          hide_create: !this._config.show_create,
          hide_completed: !this._config.show_completed,
          card_mod: {
            style: {
              'ha-textfield': {
                $: `
                  .mdc-text-field__input {
                    color: white !important;
                  }
                  .mdc-text-field {
                    --mdc-text-field-fill-color: transparent;
                    height: auto !important;
                    --text-field-padding: 0px 0px 5px 5px;
                  }
                  .mdc-line-ripple::before,
                  .mdc-line-ripple::after {
                    border-bottom-style: none !important;
                  }

                  /* === Handle enterkeyhint for mobile keyboards === */
                  const input = this.shadowRoot.querySelector('input');
                  if (input) {
                    input.enterKeyHint = 'done';
                  }
                  /* === END enterkeyhint code === */
                `
              },
              '.': `
                ha-card {
                  --mdc-typography-subtitle1-font-size: 11px;
                  ${backgroundImage ? `background: url('${backgroundImage}') no-repeat center center; background-size: cover;` : ''} 
                  box-shadow: none;
                  height: 100% !important;
                  width: 100%;
                  max-height: none;
                  overflow-y: auto;
                  border-radius: inherit;
                }

                :host {
                  --mdc-checkbox-ripple-size: 20px;
                  --mdc-text-field-idle-line-color: grey;
                  --mdc-theme-primary: grey;
                }

                ::-webkit-scrollbar {
                  display: none;
                }

                /* Hide "No tasks to do" text */
                p.empty {
                  display: none;
                }

                /* Control the Add button visibility and position */
                ${!showAddButton ? `
                ha-icon-button.addButton {
                  position: absolute !important;
                  width: 1px !important;
                  height: 1px !important;
                  overflow: hidden !important;
                  opacity: 0 !important;
                  left: -9999px !important;
                  top: -9999px !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                }` : `
                ha-icon-button.addButton {
                  position: absolute !important;
                  right: 1px !important;
                  top: 0px !important;
                  z-index: 10 !important;
                }`}

                /* Custom header styling */
                ha-card.type-todo-list div.header h2 {
                  display: none; /* Hide all header text (Actief and Voltooid) */
                }

                /* Enhanced hiding for all three-dots menu buttons - both headers */
                ha-card.type-todo-list div.header ha-button-menu,
                ha-card.type-todo-list ha-button-menu,
                ha-button-menu {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  position: absolute !important;
                  pointer-events: none !important;
                  width: 0 !important;
                  height: 0 !important;
                  overflow: hidden !important;
                  clip: rect(0 0 0 0) !important;
                  -webkit-transform: scale(0) !important;
                  transform: scale(0) !important;
                }

                /* Hide the separator completely */
                ha-card.type-todo-list div.divider {
                  display: none;
                }

                /* Hide completed menu header completely */
                ha-card.type-todo-list div.header:nth-of-type(2) {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  position: absolute !important;
                  pointer-events: none !important;
                  width: 0 !important;
                  height: 0 !important;
                  overflow: hidden !important;
                  clip: rect(0 0 0 0) !important;
                }

                /* Remove extra spacing where the header used to be */
                ha-card.type-todo-list div.header:nth-of-type(2) + div {
                  margin-top: 0;
                  padding-top: 0;
                }
                
                /* Hide completed items if not configured to show */
                ${!this._config.show_completed ? 'ha-check-list-item.editRow.completed { display: none; }' : ''}
                
                /* Hide reorder buttons */
                ha-icon-button.reorderButton {
                  display: none !important;
                }

                /* Reduce height of list items */
                ha-check-list-item {
                  min-height: 0px !important;
                }

                /* Space between checkbox and list item */  
                ha-check-list-item {
                  --mdc-list-item-graphic-margin: 5px !important;
                }
              `
            }
          }
        };
        
        const cardElement = await helpers.createCardElement(cardConfig);
        
        // Pass hass immediately if available
        if (this._hass) {
          cardElement.hass = this._hass;
        }
        
        // Setup the input field properly using a dedicated function
        const enhanceInputField = () => {
          if (!cardElement || !cardElement.shadowRoot) return;
          
          const textField = cardElement.shadowRoot.querySelector('ha-textfield');
          if (!textField || !textField.shadowRoot) return;
          
          const inputElement = textField.shadowRoot.querySelector('input');
          if (!inputElement) return;
          
          // Set enterKeyHint without using CSS template string
          inputElement.enterKeyHint = 'done';
          
          // Add a focused class to improve touch response
          textField.addEventListener('click', () => {
            if (inputElement) {
              inputElement.focus();
            }
          });
          
          debugLog("Enhanced input field setup successfully");
        };
        
        // Call enhancement function now
        enhanceInputField();
        
        // Also set up a delayed call to handle cases where the DOM isn't fully ready
        setTimeout(enhanceInputField, 500);
        
        // Store reference to the card
        this.cards[i] = {
          element: cardElement,
          slide: slideDiv,
          entityId: entityId
        };
        
        // Add card to slide
        slideDiv.appendChild(cardElement);
        
        // Add custom delete button if configured to show completed items and menu
        if (this._config.show_completed && showCompletedMenu) {
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-completed-button';
          deleteButton.title = 'Delete completed items';
          deleteButton.innerHTML = `
            <svg viewBox="0 0 24 24">
              <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
            </svg>
          `;
          
          // Add click handler for the delete button with confirmation dialog
          deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if confirmation is required
            if (this._config.delete_confirmation) {
              // Create confirmation dialog
              const dialog = document.createElement('ha-dialog');
              dialog.heading = 'Confirm Deletion';
              dialog.open = true;
              
              // Create content container
              const content = document.createElement('div');
              content.innerText = 'Are you sure you want to delete all completed items from the list?';
              dialog.appendChild(content);
              
              // Create confirm button
              const confirmButton = document.createElement('mwc-button');
              confirmButton.slot = 'primaryAction';
              confirmButton.label = 'Confirm';
              confirmButton.style.color = 'var(--primary-color)';
              confirmButton.setAttribute('aria-label', 'Confirm');
              
              // Add confirm button click handler
              confirmButton.addEventListener('click', () => {
                dialog.parentNode.removeChild(dialog);
                if (this._hass) {
                  this._hass.callService('todo', 'remove_completed_items', {
                    entity_id: entityId
                  });
                }
              });
              
              // Create cancel button
              const cancelButton = document.createElement('mwc-button');
              cancelButton.slot = 'secondaryAction';
              cancelButton.label = 'Cancel';
              cancelButton.setAttribute('aria-label', 'Cancel');
              
              // Add cancel button click handler
              cancelButton.addEventListener('click', () => {
                dialog.parentNode.removeChild(dialog);
              });
              
              // Append buttons to dialog
              dialog.appendChild(confirmButton);
              dialog.appendChild(cancelButton);
              
              // Add dialog to document
              document.body.appendChild(dialog);
            } else {
              // No confirmation needed, delete immediately
              if (this._hass) {
                this._hass.callService('todo', 'remove_completed_items', {
                  entity_id: entityId
                });
              }
            }
          });
          
          slideDiv.appendChild(deleteButton);
        }
        
        this.sliderElement.appendChild(slideDiv);
        
        // Add a function to recursively scan and remove all menu buttons
        const removeMenuButtons = (element) => {
          // Function to process an element and its shadow DOM
          const processElement = (el) => {
            if (!el) return;
            
            // Find all ha-button-menu elements in the current DOM
            const menuButtons = el.querySelectorAll('ha-button-menu');
            if (menuButtons) {
              menuButtons.forEach(btn => {
                if (btn && btn.parentNode) {
                  debugLog("Removing menu button");
                  btn.style.display = 'none';
                  btn.style.visibility = 'hidden';
                  btn.style.position = 'absolute';
                  btn.style.pointerEvents = 'none';
                }
              });
            }
            
            // Handle header elements that might contain menu buttons
            const headers = el.querySelectorAll('.header');
            if (headers) {
              headers.forEach(header => {
                const headerMenus = header.querySelectorAll('ha-button-menu');
                headerMenus.forEach(menu => {
                  if (menu && menu.parentNode) {
                    debugLog("Removing header menu button");
                    menu.style.display = 'none';
                    menu.style.visibility = 'hidden';
                    menu.style.position = 'absolute';
                    menu.style.pointerEvents = 'none';
                  }
                });
              });
            }
            
            // Process shadow DOM if available
            if (el.shadowRoot) {
              processElement(el.shadowRoot);
            }
            
            // Process all child elements that might have shadow DOM
            Array.from(el.children).forEach(child => {
              if (child.shadowRoot) {
                processElement(child);
              }
            });
          };
          
          // Start processing from the given element
          processElement(element);
        };
        
        // Wait for the card to be fully rendered and remove menu buttons
        setTimeout(() => {
          try {
            removeMenuButtons(cardElement);
          } catch (e) {
            console.error("Error removing menu buttons:", e);
          }
        }, 500);
        
      } catch (e) {
        console.error(`Error creating card ${i}:`, entityId, e);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = "color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;";
        errorDiv.textContent = `Error creating card: ${e.message || e}. Check console for details.`;
        slideDiv.appendChild(errorDiv);
        this.sliderElement.appendChild(slideDiv);
        this.cards[i] = { error: true, slide: slideDiv };
      }
    });

    // Wait for all cards to be processed
    await Promise.allSettled(cardPromises);

    // Filter out any potential gaps if errors occurred
    this.cards = this.cards.filter(Boolean);

    // Create pagination if enabled (and more than one card)
    if (this._config.show_pagination !== false && this.cards.length > 1) {
      this.paginationElement = document.createElement('div');
      this.paginationElement.className = 'pagination';

      for (let i = 0; i < this.cards.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'pagination-dot';
        if (i === this.currentIndex) dot.classList.add('active');

        // Add click handler to dots
        dot.addEventListener('click', () => {
          this.goToSlide(i);
        });

        this.paginationElement.appendChild(dot);
      }

      this.cardContainer.appendChild(this.paginationElement);
    } else {
      this.paginationElement = null;
    }

    root.appendChild(this.cardContainer);

    // Initial positioning requires element dimensions, wait for next frame
    requestAnimationFrame(() => {
      if (!this.cardContainer) {
        this.building = false;
        return;
      }
      
      this.slideWidth = this.cardContainer.offsetWidth;
      // Ensure currentIndex is valid before updating slider
      this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.cards.length - 1));
      
      // Apply border radius to all slides - ADDED THIS
      const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
      this.cards.forEach(cardData => {
        if (cardData.slide) {
          cardData.slide.style.borderRadius = cardBorderRadius;
        }
      });
      
      this.updateSlider(false); // Update without animation initially

      // Setup resize observer only after initial layout
      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          // Debounce resize handling slightly
          if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            if (!this.cardContainer) return;
            
            const newWidth = this.cardContainer.offsetWidth;
            // Only update if width actually changed significantly
            if (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) {
              debugLog("Resizing slider...");
              this.slideWidth = newWidth;
              
              // Reapply border radius when resizing - ADDED THIS
              const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
              this.cards.forEach(cardData => {
                if (cardData.slide) {
                  cardData.slide.style.borderRadius = cardBorderRadius;
                }
              });
              
              this.updateSlider(false); // Update without animation on resize
            }
          }, 50); // 50ms debounce
        });
        this.resizeObserver.observe(this.cardContainer);
      }
    });

    // Add swipe detection only if more than one card
    if (this.cards.length > 1) {
      this._addSwiperGesture();
    }

    // Mark as initialized AFTER build completes
    this.initialized = true;
    this.building = false;
    debugLog("Regular card build completed.");
    
    // Add a periodic check to ensure menu buttons remain hidden (for Android)
    this._startMenuButtonRemovalInterval();
  }
  
  /**
   * Start interval to periodically check and remove menu buttons
   * @private
   */
  _startMenuButtonRemovalInterval() {
    // Clear any existing interval
    if (this._menuCheckInterval) {
      clearInterval(this._menuCheckInterval);
    }
    
    // Create a new interval to check every 2 seconds
    this._menuCheckInterval = setInterval(() => {
      // Safety check that cards exist
      if (!this.isConnected || !this.cards || !this.cards.length) {
        clearInterval(this._menuCheckInterval);
        return;
      }
      
      this.cards.forEach(card => {
        if (card && card.element && card.element.shadowRoot) {
          // Find all ha-button-menu elements in the card
          const findAndRemoveMenus = (root) => {
            if (!root) return;
            
            try {
              // Direct children
              const menus = root.querySelectorAll('ha-button-menu');
              if (menus.length) {
                menus.forEach(menu => {
                  if (menu && menu.parentNode) {
                    // Add a style to ensure it's hidden
                    menu.style.display = 'none';
                    menu.style.visibility = 'hidden';
                    menu.style.opacity = '0';
                    menu.style.pointerEvents = 'none';
                    menu.style.position = 'absolute';
                    
                    // Add a direct inline style to the parent header if it exists
                    if (menu.parentNode.classList?.contains('header')) {
                      menu.parentNode.style.display = 'none';
                      menu.parentNode.style.visibility = 'hidden';
                    }
                  }
                });
              }
              
              // Look for shadow roots in children
              root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) {
                  findAndRemoveMenus(el.shadowRoot);
                }
              });
            } catch (e) { /* Ignore errors during check */ }
          };
          
          try {
            findAndRemoveMenus(card.element.shadowRoot);
          } catch (e) {
            // Ignore errors in the periodic check
          }
        }
      });
    }, 2000); // Check every 2 seconds
  }

  /**
   * Add swipe gesture handling
   * @private
   */
  _addSwiperGesture() {
    // Remove previous listeners if rebuilding to prevent duplicates
    if (this._touchStartHandler) {
      this.cardContainer.removeEventListener('touchstart', this._touchStartHandler);
      this.cardContainer.removeEventListener('touchmove', this._touchMoveHandler);
      this.cardContainer.removeEventListener('touchend', this._touchEndHandler);
      this.cardContainer.removeEventListener('touchcancel', this._touchEndHandler);
      this.cardContainer.removeEventListener('mousedown', this._mouseDownHandler);
      window.removeEventListener('mousemove', this._mouseMoveHandler);
      window.removeEventListener('mouseup', this._mouseUpHandler);
    }

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isScrolling = false;
    let initialTransform = 0;

    // --- Define handlers as bound instance methods ---
    this._handleSwipeStart = (e) => {
      // Ignore if already dragging or if triggered by non-primary button/touch
      if (isDragging || (e.type === 'mousedown' && e.button !== 0)) return;

      // Determine if touch/click started on an interactive element or scrollable area
      if (this._isInteractiveOrScrollable(e.target)) {
        return;
      }

      isDragging = true;
      isScrolling = false;

      if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
        // Prevent text selection during drag for mouse
        e.preventDefault();
      }
      currentX = startX;

      // Disable transition and record initial transform
      if (this.sliderElement) {
        const style = window.getComputedStyle(this.sliderElement);
        const matrix = new DOMMatrixReadOnly(style.transform);
        initialTransform = matrix.m41;
        this.sliderElement.style.transition = 'none';
        this.sliderElement.style.cursor = 'grabbing';
      }

      // Add mouse move/up listeners to window for mouse events
      if (e.type === 'mousedown') {
        window.addEventListener('mousemove', this._mouseMoveHandler);
        window.addEventListener('mouseup', this._mouseUpHandler);
      }
    };

    this._handleSwipeMove = (e) => {
      if (!isDragging) return;

      let moveX, moveY, clientX, clientY;

      if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      moveX = clientX - startX;
      moveY = clientY - startY;

      // Check for vertical scroll intention early
      if (!isScrolling && Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 10) {
        isScrolling = true;
        return;
      }

      // If primarily horizontal movement or not yet decided it's vertical
      if (!isScrolling && Math.abs(moveX) > 5) {
        // Prevent default browser actions only when horizontal swipe is clearly intended
        if (e.cancelable) e.preventDefault();

        currentX = clientX; // Update current position

        // Calculate total drag displacement
        let totalDragOffset = currentX - startX;

        // Apply resistance at the edges
        const atLeftEdge = this.currentIndex === 0;
        const atRightEdge = this.currentIndex === this.cards.length - 1;
        if ((atLeftEdge && totalDragOffset > 0) || (atRightEdge && totalDragOffset < 0)) {
          // Apply stronger resistance for overscroll
          const overDrag = Math.abs(totalDragOffset);
          const resistanceFactor = 0.3 + 0.7 / (1 + overDrag / (this.slideWidth * 0.5));
          totalDragOffset *= resistanceFactor * 0.5;
        }

        // Calculate the new transform
        const newTransform = initialTransform + totalDragOffset;

        if (this.sliderElement) {
          this.sliderElement.style.transform = `translateX(${newTransform}px)`;
        }
      }
    };

    this._handleSwipeEnd = (e) => {
      // Remove window listeners for mouse events
      if (e.type === 'mouseup' || e.type === 'mouseleave') {
        window.removeEventListener('mousemove', this._mouseMoveHandler);
        window.removeEventListener('mouseup', this._mouseUpHandler);
      }

      if (!isDragging) return;

      const wasDragging = isDragging; // Store state before resetting
      isDragging = false;

      // Re-enable transition and reset cursor
      if (this.sliderElement) {
        this.sliderElement.style.transition = 'transform 0.3s ease-out';
        this.sliderElement.style.cursor = '';
      }

      // If we detected vertical scrolling or cancelled, just snap back
      if (isScrolling || e.type === 'touchcancel') {
        this.updateSlider();
        isScrolling = false;
        return;
      }

      // If it wasn't really a drag (e.g. just a click), don't process swipe logic
      if (!wasDragging) return;

      // Calculate total displacement from the start
      const totalMoveX = currentX - startX;

      // Determine if swipe was significant enough to change slide
      const threshold = this.slideWidth * 0.20; // 20% threshold

      let movedSlide = false;
      if (Math.abs(totalMoveX) > threshold) {
        if (totalMoveX > 0 && this.currentIndex > 0) {
          // Swipe right -> previous slide
          this.currentIndex--;
          movedSlide = true;
        } else if (totalMoveX < 0 && this.currentIndex < this.cards.length - 1) {
          // Swipe left -> next slide
          this.currentIndex++;
          movedSlide = true;
        }
      }

      // Snap to the new or current slide position
      this.updateSlider(true); // Always animate the snap
    };

    // Helper to check for interactive elements or scrollable containers
    this._isInteractiveOrScrollable = (element) => {
      if (!element || element === this.cardContainer || element === this.sliderElement) return false;

      const interactiveTags = [
        'input', 'textarea', 'select', 'button', 'a', 'ha-switch', 'ha-checkbox',
        'mwc-checkbox', 'paper-checkbox', 'ha-textfield', 'ha-slider', 'paper-slider',
        'ha-icon-button', 'mwc-button', 'paper-button'
      ];
      const tagName = element.localName?.toLowerCase();
      const role = element.getAttribute('role');

      // Check direct tag name or common roles
      if (interactiveTags.includes(tagName) || (role && ['button', 'checkbox', 'switch', 'slider', 'link', 'menuitem', 'textbox'].includes(role))) {
        return true;
      }

      // Check common component host elements
      if (element.closest('ha-control-button, ha-control-select, ha-control-slider, ha-control-button-group, ha-alert, mwc-list-item, paper-item, ha-list-item')) {
        return true;
      }

      // Check if the element or an ancestor is scrollable
      let current = element;
      let depth = 0; // Limit depth to prevent infinite loops
      while (current && current !== this.sliderElement && current !== this.cardContainer && depth < 10) {
        try {
          if (current.nodeType === Node.ELEMENT_NODE) {
            const style = window.getComputedStyle(current);
            const overflowY = style.overflowY;
            const isScrollable = (overflowY === 'auto' || overflowY === 'scroll');
            // Check if scrollHeight is significantly larger than clientHeight
            if (isScrollable && current.scrollHeight > current.clientHeight + 1) {
              return true;
            }
            // Check specific known scrollable components
            if (current.localName === 'ha-logbook' || current.localName === 'hui-logbook-card' || current.localName === 'hui-history-graph-card') {
              return true;
            }
          }
        } catch (e) { /* Ignore errors during check */ }
        
        current = current.assignedSlot || current.parentNode || (current.getRootNode instanceof Function && current.getRootNode().host ? current.getRootNode().host : null);
        depth++;
      }

      return false;
    };

    // Store bound handlers for removal
    this._touchStartHandler = this._handleSwipeStart.bind(this);
    this._touchMoveHandler = this._handleSwipeMove.bind(this);
    this._touchEndHandler = this._handleSwipeEnd.bind(this);
    this._mouseDownHandler = this._handleSwipeStart.bind(this);
    this._mouseMoveHandler = this._handleSwipeMove.bind(this);
    this._mouseUpHandler = this._handleSwipeEnd.bind(this);

    // Add listeners
    this.cardContainer.addEventListener('touchstart', this._touchStartHandler, { passive: true });
    this.cardContainer.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
    this.cardContainer.addEventListener('touchend', this._touchEndHandler, { passive: true });
    this.cardContainer.addEventListener('touchcancel', this._touchEndHandler, { passive: true });

    // Add mouse listeners
    this.cardContainer.addEventListener('mousedown', this._mouseDownHandler);
    // Note: mousemove and mouseup are added to window in _handleSwipeStart
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

    // Set transition based on animate parameter
    this.sliderElement.style.transition = animate ? 'transform 0.3s ease-out' : 'none';

    // Get card spacing from config
    const cardSpacing = this._config.card_spacing || 0;

    // Update slider gap for spacing
    this.sliderElement.style.gap = `${cardSpacing}px`;

    // Calculate transform using pixel values including spacing
    // Each slide is 100% width + cardSpacing gap
    const translateX = this.currentIndex * (this.slideWidth + cardSpacing);
    this.sliderElement.style.transform = `translateX(-${translateX}px)`;

    // Get the border radius from the container and apply to all slides - ADDED THIS
    const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
    this.cards.forEach((card) => {
      if (card.slide) {
        card.slide.style.marginRight = '0px'; // Ensure margins are reset
        card.slide.style.borderRadius = cardBorderRadius; // Apply border radius to slides
      }
    });

    // Update pagination
    if (this.paginationElement) {
      const dots = this.paginationElement.querySelectorAll('.pagination-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }
  }

  /**
   * Get card size for Home Assistant layout system
   * @returns {number} Card size
   */
  getCardSize() {
    return 3;
  }
}

/**
 * Card editor for TodoSwipeCard
 * @extends LitElement
 */
class TodoSwipeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Force render update when the editor is connected to the DOM
    // This helps ensure entities appear after cache clears
    debugLog("TodoSwipeCardEditor - Connected to DOM");
    setTimeout(() => {
      this.requestUpdate();
    }, 100);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Check if entities exist but are not rendering
    if (this._config && this._config.entities && this._config.entities.length > 0) {
      const entityPickers = this.shadowRoot.querySelectorAll('ha-entity-picker');
      if (entityPickers.length === 0 || entityPickers.length < this._config.entities.length) {
        debugLog("TodoSwipeCardEditor - Entity pickers missing, forcing update");
        this.requestUpdate();
      }
    }
  }

  setConfig(config) {
    debugLog("Editor setConfig called with:", JSON.stringify(config));
    
    // Start with the stub config for defaults
    this._config = {
      ...TodoSwipeCard.getStubConfig()
    };
    
    // Then apply the provided config
    if (config) {
      // Handle entities specially to ensure it's always an array
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
      
      // Filter out empty entries
      entities = entities.filter(e => e && e.trim() !== "");
      
      // Ensure card_spacing is a valid number
      let cardSpacing = config.card_spacing;
      if (cardSpacing === undefined) {
        cardSpacing = 15; // Default spacing
      } else {
        cardSpacing = parseInt(cardSpacing);
        if (isNaN(cardSpacing) || cardSpacing < 0) {
          cardSpacing = 15;
        }
      }
      
      // Merge config, overriding stub with provided values plus our cleaned entities and spacing
      this._config = {
        ...this._config,
        ...config,
        entities,
        card_spacing: cardSpacing
      };
    }
    
    // Ensure background_images is an object
    if (!this._config.background_images || typeof this._config.background_images !== 'object') {
      this._config.background_images = {};
    }
    
    // Debug log to help identify issues after cache clear
    debugLog("TodoSwipeCardEditor - Config after initialization:", JSON.stringify(this._config));
    
    // Force a render update to ensure entities display correctly
    this.requestUpdate();
  }

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

  get _card_spacing() {
    return this._config.card_spacing !== undefined ? this._config.card_spacing : 15;
  }

  // Get a list of valid entities (not empty strings)
  get _validEntities() {
    return (this._config.entities || []).filter(entity => entity && entity.trim() !== "");
  }

  // Check if we should show the background images section
  get _showBackgroundImagesSection() {
    return this._validEntities.length > 0;
  }

  // Check if we should show the completed menu option
  get _showCompletedMenuOption() {
    return this._show_completed;
  }
  
  // Check if we should show the delete confirmation option
  get _showDeleteConfirmationOption() {
    return this._show_completed && this._show_completed_menu;
  }

  // This static method ensures the editor UI refreshes properly when reopened
  static get styles() {
    return css`
      ha-switch {
        padding: 8px 0;
      }
      .side-by-side {
        display: flex;
        align-items: center;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 8px;
      }
      .entity-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        width: 100%;
      }
      .entity-row ha-entity-picker {
        flex-grow: 1;
        margin-right: 8px;
      }
      .entity-row ha-icon-button {
        flex-shrink: 0;
      }
      .section-header {
        margin-top: 24px;
        margin-bottom: 16px;
        color: var(--secondary-text-color);
        font-weight: 500;
        font-size: 16px;
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 5px;
      }
      ha-formfield {
        display: block;
        padding: 8px 0;
      }
      .background-image-row {
        margin-top: 8px;
        width: 100%;
      }
      .background-image-row ha-textfield {
        width: 100%;
      }
      .background-help-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        margin-bottom: 16px;
      }
      .conditional-field {
        padding-left: 16px;
        margin-top: 0;
        border-left: 1px solid var(--divider-color);
        width: calc(100% - 16px);
      }
      .add-entity-button {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        margin-bottom: 24px;
      }
      .add-todo-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: var(--primary-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
      }
      .add-todo-button:hover {
        background-color: var(--secondary-background-color);
      }
      .info-panel {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        margin: 8px 0 24px 0;
        background-color: var(--primary-background-color);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }
      .info-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: var(--info-color, #4a90e2);
        color: white;
        margin-right: 12px;
        flex-shrink: 0;
      }
      .info-text {
        flex-grow: 1;
        color: var(--primary-text-color);
        font-size: 14px;
      }
      .version-display {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .version-text {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 500;
      }
      .version-badge {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border-radius: 16px;
        padding: 4px 12px;
        font-size: 14px;
        font-weight: 500;
        margin-left: auto;
      }
      .spacing-field {
        margin-top: 16px;
        margin-bottom: 16px;
        width: 100%;
      }
      .spacing-field ha-textfield {
        width: 100%;
        display: block;
      }
      .spacing-help-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        margin-bottom: 16px;
      }
      .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
        width: 100%;
      }
      .toggle-option-label {
        font-size: 14px;
      }
      .version-info {
        font-size: 12px;
        color: var(--primary-color);
        margin-top: 4px;
      }
      .todo-lists-container, 
      .display-options-container, 
      .background-images-container {
        width: 100%;
      }
      
      .nested-toggle-option {
        margin-left: 16px;
        padding-left: 8px;
        border-left: 1px solid var(--divider-color);
      }
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    const value = target.checked !== undefined ? target.checked : target.value;
    const configValue = target.configValue || target.getAttribute('data-config-value');
    
    if (configValue) {
      // Create a new config object with the updated value
      const newConfig = { ...this._config, [configValue]: value };
      this._config = newConfig; // Update internal state first
      
      // Dispatch the event with the updated config
      debugLog(`Config value changed: ${configValue} = ${value}`, newConfig);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    }
  }

  _cardSpacingChanged(ev) {
    if (!this._config) return;
    
    const value = parseInt(ev.target.value);
    if (!isNaN(value) && value >= 0) {
      const newConfig = { ...this._config, card_spacing: value };
      this._config = newConfig; // Update internal state first
      
      debugLog(`Card spacing changed to: ${value}`, newConfig);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    }
  }

  _addEntity(e) {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!this._config) return;
    
    // Create a deep copy of the current config to avoid reference issues
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure entities is an array
    if (!Array.isArray(newConfig.entities)) {
      newConfig.entities = newConfig.entities ? [newConfig.entities] : [];
    }
    
    // Add a new empty entity
    newConfig.entities.push("");
    
    // Update internal state first
    this._config = newConfig;
    
    // Request an update to ensure the UI reflects the change
    this.requestUpdate();
    
    // Dispatch the event
    debugLog("Adding new entity", newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
  }

  _removeEntity(index) {
    if (!this._config || !Array.isArray(this._config.entities)) return;
    
    // Create deep copies of arrays/objects to ensure change detection
    const entities = [...this._config.entities];
    const backgroundImages = {...this._config.background_images};
    
    // Get the entity being removed
    const removedEntityId = entities[index];
    
    // Remove the entity
    entities.splice(index, 1);
    
    // Also remove associated background image if it exists
    if (removedEntityId && backgroundImages[removedEntityId]) {
        delete backgroundImages[removedEntityId];
    }

    // Create a new config with the updated arrays
    const newConfig = { 
        ...this._config, 
        entities, 
        background_images: backgroundImages 
    };
    
    // Update internal state first
    this._config = newConfig;
    
    // Dispatch the event with the new config
    debugLog(`Removing entity at index ${index}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    
    // Force UI update
    this.requestUpdate();
  }

  _entityChanged(ev) {
    // Safely handle the case where index might be null/undefined
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;
    
    const newValue = ev.detail?.value || ev.target.value || "";
    const oldValue = this._config.entities[index]; // Get the old value
    
    // Check if the value actually changed
    if (newValue === oldValue) return;
    
    // Create deep copies to ensure change detection
    const entities = [...this._config.entities];
    const backgroundImages = {...this._config.background_images};
    
    // Update the entity
    entities[index] = newValue;

    // Update background image key if entity changed
    if (oldValue && backgroundImages[oldValue]) {
        if (newValue) { // If new value is not empty, transfer the background
            backgroundImages[newValue] = backgroundImages[oldValue];
        }
        delete backgroundImages[oldValue]; // Remove the old key entry
    }

    // Create a new config with the updates
    const newConfig = { 
        ...this._config, 
        entities, 
        background_images: backgroundImages 
    };
    
    // Update internal state first
    this._config = newConfig;
    
    // Dispatch the event
    debugLog(`Entity at index ${index} changed from "${oldValue}" to "${newValue}"`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    
    // Force UI update
    this.requestUpdate();
  }

  _backgroundImageChanged(ev) {
    if (!ev.target) return;
    
    const entityId = ev.target.getAttribute('data-entity');
    if (!entityId) return;
    
    const imageUrl = ev.target.value || "";
    
    // Create a new background_images object
    const backgroundImages = { ...this._config.background_images };

    // Update or remove the image URL
    if (imageUrl) {
      backgroundImages[entityId] = imageUrl;
    } else {
      delete backgroundImages[entityId];
    }

    // Create new config with updated background_images
    const newConfig = { ...this._config, background_images: backgroundImages };
    
    // Update internal state first
    this._config = newConfig;
    
    // Dispatch the event
    debugLog(`Background image for ${entityId} changed to "${imageUrl}"`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
  }

  render() {
    if (!this.hass || !this._config) {
      return html`<div>Loading...</div>`;
    }

    // Make sure we have an entities array
    const entities = Array.isArray(this._config.entities) ? this._config.entities : [];
    
    debugLog("Rendering editor with config:", JSON.stringify(this._config));
    debugLog("Current entities:", entities);

    return html`
      <div class="card-config">
        <div class="info-panel">
          <div class="info-icon">i</div>
          <div class="info-text">
            When adding (additional) to-do lists, you may need to click the "+" button twice. 
            The first click updates the configuration, and the second click shows the entity picker.
          </div>
        </div>

        <!-- Todo Lists Section -->
        <div class="todo-lists-container">
          <div class="section-header">Todo Lists</div>
          ${entities.map((entity, index) => html`
            <div class="entity-row">
              <ha-entity-picker
                .hass=${this.hass}
                .value=${entity}
                .includeDomains=${['todo']}
                data-index=${index}
                @value-changed=${this._entityChanged}
                allow-custom-entity
              ></ha-entity-picker>
              <ha-icon-button
                .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'} /* Close icon */
                @click=${() => this._removeEntity(index)}
                title="Remove this list"
              ></ha-icon-button>
            </div>
          `)}
          <div class="add-entity-button">
            <button class="add-todo-button" @click=${this._addEntity}>
              <svg style="width:20px;height:20px;margin-right:8px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              ADD TODO LIST
            </button>
          </div>
        </div>

        <!-- Display Options Section -->
        <div class="display-options-container">
          <div class="section-header">Display Options</div>

          <!-- Card spacing -->
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
            <div class="spacing-help-text">
              Visual gap between cards when swiping (in pixels)
            </div>
          </div>

          <!-- Toggle options -->
          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this._show_pagination}
              data-config-value="show_pagination"
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

          <!-- Conditional Add Button option nested under Show create field -->
          ${this._show_create ? html`
            <div class="nested-toggle-option">
              <div class="toggle-option">
                <div class="toggle-option-label">Show '+' add button next to field</div>
                <ha-switch
                  .checked=${this._show_addbutton}
                  data-config-value="show_addbutton"
                  @change=${this._valueChanged}
                ></ha-switch>
              </div>
            </div>
          ` : ''}

          <!-- Show completed items -->
          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this._show_completed}
              data-config-value="show_completed"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <!-- Conditional Completed Menu option -->
          ${this._show_completed ? html`
            <div class="nested-toggle-option">
              <div class="toggle-option">
                <div class="toggle-option-label">Show 'Delete completed' button</div>
                <ha-switch
                  .checked=${this._show_completed_menu}
                  data-config-value="show_completed_menu"
                  @change=${this._valueChanged}
                ></ha-switch>
              </div>
              
              <!-- Delete confirmation option (only visible when delete button is shown) -->
              ${this._show_completed_menu ? html`
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
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Background images -->
        ${this._showBackgroundImagesSection ? html`
          <div class="background-images-container">
            <div class="section-header">Background Images</div>
            <div class="background-help-text">
              Optional. Enter the path to an image (e.g., /local/images/bg.jpg).
            </div>
            ${this._validEntities.map(entityId => {
              // Get the display name with proper capitalization
              const entityName = this.hass.states[entityId]?.attributes?.friendly_name ||
                                entityId.split('.').pop().replace(/_/g, ' ');
              return html`
                <div class="background-image-row">
                  <ha-textfield
                    label="${entityName}"
                    .value=${this._config.background_images && this._config.background_images[entityId] || ""}
                    data-entity=${entityId}
                    @input=${this._backgroundImageChanged}
                  ></ha-textfield>
                </div>
              `;
            })}
          </div>
        ` : ''}

        <!-- Version display -->
        <div class="version-display">
          <div class="version-text">Todo Swipe Card</div>
          <div class="version-badge">v1.5.1</div>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-swipe-card', TodoSwipeCard);
customElements.define('todo-swipe-card-editor', TodoSwipeCardEditor);

// Add card to UI picker
if (!window.customCards) {
  window.customCards = [];
}

// Ensure registration happens only once
let registered = window.customCards.some(card => card.type === "todo-swipe-card");
if (!registered) {
  window.customCards.push({
    type: "todo-swipe-card",
    name: "Todo Swipe Card",
    preview: true, // Enable preview
    description: "A specialized swipe card for to-do lists with built-in styling (requires card-mod)",
  });
  debugLog("Todo Swipe Card registered in customCards");
}

// Version logging
console.info(
  `%c TODO-SWIPE-CARD %c v1.5.1 %c - A swipeable card for to-do lists`,
  "color: white; background: #4caf50; font-weight: 700;",
  "color: #4caf50; background: white; font-weight: 700;",
  "color: grey; background: white; font-weight: 400;"
);
