/**
 * TODO SWIPE CARD CSS VARIABLES REFERENCE
 *
 * This card supports extensive customization through CSS variables. All variables are optional
 * and fall back to sensible defaults. Variables can be set via Home Assistant themes or
 * card-mod styling.
 *
 * USAGE EXAMPLES:
 *
 * Via Home Assistant theme (applies to all instances):
 * ```yaml
 * frontend:
 *   themes:
 *     my_theme:
 *       todo-swipe-card-text-color: "#2c3e50"
 *       todo-swipe-card-background: "#ffffff"
 * ```
 *
 * Via card-mod (applies to specific card):
 * ```yaml
 * type: custom:todo-swipe-card
 * card_mod:
 *   style: |
 *     :host {
 *       --todo-swipe-card-text-color: #2c3e50;
 *       --todo-swipe-card-background: linear-gradient(45deg, #667eea, #764ba2);
 *     }
 * ```
 *
 * VARIABLE CATEGORIES:
 *
 * 🎨 CORE APPEARANCE
 * --todo-swipe-card-background: Main card background (color/gradient/image)
 * --todo-swipe-card-text-color: Primary text color for todo items
 *
 * 📝 TYPOGRAPHY & LAYOUT
 * --todo-swipe-card-font-size: Base font size for todo text (default: 11px)
 * --todo-swipe-card-item-font-weight: Font weight for todo item text
 * --todo-swipe-card-line-height: Line height for multi-line text (default: 1.3)
 * --todo-swipe-card-item-height: Minimum height per todo item
 * --todo-swipe-card-item-margin: Space between checkbox and text (default: 5px)
 * --todo-swipe-card-item-align: Vertical alignment: flex-start|center|flex-end
 *
 * 📅 DUE DATE STYLING
 * --todo-swipe-card-font-size-due-date: Due date text size (default: 11px)
 * --todo-swipe-card-font-weight-due-date: Due date font weight
 * --todo-swipe-card-font-color-due-date: Normal due date color
 * --todo-swipe-card-font-color-due-date-overdue: Overdue date color (red warning)
 * --todo-swipe-card-due-icon-size: Clock icon size (default: 14px)
 * --todo-swipe-card-due-date-margin-top: Space above due date (default: 2px)
 *
 * 📄 DESCRIPTION STYLING
 * --todo-swipe-card-font-size-description: Description text size
 * --todo-swipe-card-font-weight-description: Description font weight
 * --todo-swipe-card-font-color-description: Description text color (muted)
 * --todo-swipe-card-description-margin-top: Space above description (default: 1px)
 *
 * 🏷️ TITLE CONFIGURATION
 * --todo-swipe-card-title-height: Title bar height (default: 40px)
 * --todo-swipe-card-title-background: Title background color
 * --todo-swipe-card-title-color: Title text color
 * --todo-swipe-card-title-font-size: Title font size (default: 16px)
 * --todo-swipe-card-title-font-weight: Title font weight (default: 500)
 * --todo-swipe-card-title-align: Title alignment: left|center|right
 * --todo-swipe-card-title-border-color: Border color below title
 * --todo-swipe-card-title-border-width: Border thickness (default: 1px)
 * --todo-swipe-card-title-padding-horizontal: Left/right title padding (default: 16px)
 *
 * ☑️ CHECKBOX CUSTOMIZATION
 * --todo-swipe-card-checkbox-color: Unchecked checkbox color (supports rgba for opacity)
 * --todo-swipe-card-checkbox-checked-color: Checked checkbox color
 * --todo-swipe-card-checkbox-checkmark-color: Checkmark symbol color
 * --todo-swipe-card-checkbox-size: Checkbox dimensions (default: 18px)
 * --todo-swipe-card-checkbox-margin-top: Fine positioning adjustment (default: 1px)
 *
 * 🎯 ICONS & BUTTONS
 * --todo-swipe-card-icon-size: Todo list icon size (default: 48px)
 * --todo-swipe-card-icon-color: Icon color (supports opacity)
 * --todo-swipe-card-icon-opacity: Icon transparency (default: 0.6)
 * --todo-swipe-card-icon-right: Distance from right edge (default: 16px)
 * --todo-swipe-card-icon-bottom: Distance from bottom (default: 8px)
 * --todo-swipe-card-add-button-color: Plus button color
 * --todo-swipe-card-delete-button-color: Delete button color
 * --todo-swipe-card-delete-button-top: Manual delete button positioning
 *
 * 📱 INPUT FIELDS
 * --todo-swipe-card-placeholder-color: "Add item" placeholder text color
 * --todo-swipe-card-placeholder-opacity: Placeholder transparency (default: 1)
 * --todo-swipe-card-input-font-weight: Font weight for typed text
 * --todo-swipe-card-placeholder-font-weight: Font weight for placeholder
 *
 * 🔍 SEARCH FUNCTIONALITY
 * --todo-swipe-card-search-counter-font-size: Search results counter size (default: 12px)
 * --todo-swipe-card-search-counter-color: Search counter text color
 *
 * 🔘 PAGINATION DOTS
 * --todo-swipe-card-pagination-dot-size: Dot diameter (default: 8px)
 * --todo-swipe-card-pagination-dot-active-color: Active dot color
 * --todo-swipe-card-pagination-dot-inactive-color: Inactive dot color
 * --todo-swipe-card-pagination-dot-spacing: Space between dots (default: 4px)
 * --todo-swipe-card-pagination-dot-border-radius: Dot roundness (default: 50%)
 * --todo-swipe-card-pagination-dot-active-size-multiplier: Active dot size ratio (default: 1)
 * --todo-swipe-card-pagination-bottom: Distance from bottom (default: 8px)
 * --todo-swipe-card-pagination-background: Pagination area background
 * --todo-swipe-card-pagination-dot-active-opacity: Active dot opacity (default: 1)
 * --todo-swipe-card-pagination-dot-inactive-opacity: Inactive dot opacity (default: 0.6)
 *
 * 🎬 ANIMATIONS & TRANSITIONS
 * --todo-swipe-card-transition-speed: Swipe animation duration (default: 0.3s)
 * --todo-swipe-card-transition-easing: Animation timing function (default: ease-out)
 *
 * 📏 SPACING & MARGINS
 * --todo-swipe-card-item-spacing: Margin between todo items (default: 1px)
 * --todo-swipe-card-summary-margin-top: Space above main todo text (default: 3px)
 *
 * ADVANCED POSITIONING CALCULATIONS:
 * Some variables use calc() expressions for dynamic positioning:
 * - Delete button auto-adjusts position when titles are present
 * - Item heights adapt to font size changes
 * - Active pagination dots can scale proportionally
 */

import { css } from '../core/Dependencies.js';

/**
 * Create base styles for the card
 * @param {Object} config - Card configuration
 * @returns {HTMLStyleElement} Style element
 */
export function createBaseStyles(config) {
  const style = document.createElement('style');
  style.textContent = `
    :host {
      display: block;
      overflow: hidden;
      width: 100%;
      height: 100%;
      --card-border-radius: var(--ha-card-border-radius, 12px);
      border-radius: var(--card-border-radius);
    }

    .card-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }
    
    .card-container, .slide {
      border-radius: var(--card-border-radius) !important;
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
      border-radius: var(--card-border-radius);
      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));
    }

    .pagination {
      position: absolute;
      bottom: var(--todo-swipe-card-pagination-bottom, 8px);
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      background-color: var(--todo-swipe-card-pagination-background, transparent);
    }

    .pagination-dot {
      width: var(--todo-swipe-card-pagination-dot-size, 8px);
      height: var(--todo-swipe-card-pagination-dot-size, 8px);
      border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);
      margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);
      background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
      opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);
      cursor: pointer;
      transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
      flex-shrink: 0;
    }

    .pagination-dot.active {
      background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
      width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
      height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
      opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);
    }
    
    .delete-completed-button {
      position: absolute;
      right: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));
      padding: 4px;
      background-color: transparent;
      border: none;
      color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
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
    
    /* Todo icon styling */
    .todo-icon {
      position: absolute;
      right: var(--todo-swipe-card-icon-right, 16px);
      bottom: var(--todo-swipe-card-icon-bottom, 8px);
      width: var(--todo-swipe-card-icon-size, 48px);
      height: var(--todo-swipe-card-icon-size, 48px);
      color: var(--todo-swipe-card-icon-color, rgba(255, 255, 255, 0.3));
      opacity: var(--todo-swipe-card-icon-opacity, 0.6);
      z-index: 1;
      pointer-events: none;
      --mdc-icon-size: var(--todo-swipe-card-icon-size, 48px);
    }

    .native-todo-card {
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      border-radius: var(--card-border-radius);
      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));
      color: var(--todo-swipe-card-text-color, var(--primary-text-color));
      font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));
      position: relative;
      
      /* Hide scrollbar for all browsers */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }

    .native-todo-card::-webkit-scrollbar {
      display: none; /* WebKit browsers (Chrome, Safari, Edge) */
    }

    .todo-card-with-title-wrapper .native-todo-card {
      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
    }

    .add-row {
      padding: 8px 12px;
      padding-bottom: 0;
      margin-bottom: 6px; /* 6px + 4px todo-list padding = 10px total when no search */
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .add-row.has-search-counter {
      margin-bottom: 0px; /* 4px gap to search counter when search is active */
    }

    .add-textfield {
      flex-grow: 1;
      margin-right: 8px;
    }

    .add-textfield input {
      color: var(--todo-swipe-card-text-color, var(--primary-text-color)) !important;
      font-weight: var(--todo-swipe-card-input-font-weight, normal) !important;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      padding: 8px 8px 2px 8px !important;
      margin-left: -4px !important;
      margin-top: 3px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      font-size: inherit !important;
      font-family: inherit !important;
    }

    .add-textfield input::placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-textfield input::-webkit-input-placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: 1 !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-textfield input::-moz-placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: 1 !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-button {
      position: absolute;
      right: 5px;
      top: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--todo-swipe-card-add-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
      opacity: ${config?.show_addbutton ? '1' : '0'};
      visibility: ${config?.show_addbutton ? 'visible' : 'hidden'};
      pointer-events: ${config?.show_addbutton ? 'auto' : 'none'};
    }

    .add-button:hover {
      background-color: rgba(127, 127, 127, 0.1);
    }

    .add-button svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .todo-list {
      padding: 4px 0;
    }

    .header {
      display: none;
    }

    .empty {
      display: none;
    }

    .todo-item {
      display: flex;
      align-items: var(--todo-swipe-card-item-align, flex-start);
      padding: 1px 12px;
      min-height: var(--todo-swipe-card-item-height, calc(var(--todo-swipe-card-font-size, 11px) + 8px));
      margin-top: var(--todo-swipe-card-item-spacing, 1px);
      cursor: pointer;
      position: relative;
      padding-right: 30px;
    }

    .todo-item:first-child {
      margin-top: 0 !important;
    }

    .todo-item:hover {
      background-color: rgba(127, 127, 127, 0.1);
    }

    .todo-checkbox {
      margin-right: var(--todo-swipe-card-item-margin, 5px);
      margin-top: var(--todo-swipe-card-checkbox-margin-top, 1px);
      margin-left: 4px;
      flex-shrink: 0;
      opacity: 70%;
      --mdc-checkbox-unchecked-color: var(--todo-swipe-card-checkbox-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
      --mdc-checkbox-checked-color: var(--todo-swipe-card-checkbox-checked-color, var(--primary-color));
      --mdc-checkbox-ink-color: var(--todo-swipe-card-checkbox-checkmark-color, white);
      --mdc-checkbox-mark-color: var(--todo-swipe-card-checkbox-checkmark-color, white);
      --mdc-checkbox-size: var(--todo-swipe-card-checkbox-size, 18px);
      --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 18px);
      --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 18px);
    }

    .todo-content {
      flex: 1;
      max-width: calc(100% - 30px);
      overflow: visible;
      color: var(--todo-swipe-card-text-color, var(--primary-text-color));
      font-weight: var(--todo-swipe-card-item-font-weight, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .todo-summary {
      margin: 0;
      margin-top: var(--todo-swipe-card-summary-margin-top, 3px);
      padding: 0;
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: none;
      word-break: normal;        
    }

    .todo-item.completed .todo-summary {
      text-decoration: line-through;
    }

    .todo-description {
      margin-top: var(--todo-swipe-card-description-margin-top, 1px);
      color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color));
      font-size: var(--todo-swipe-card-font-size-description, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)));
      font-weight: var(--todo-swipe-card-font-weight-description, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .todo-due {
      margin-top: var(--todo-swipe-card-due-date-margin-top, 2px);
      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));
      font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px))));
      font-weight: var(--todo-swipe-card-font-weight-due-date, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      display: flex;
      align-items: flex-start;
      gap: 3px;
    }

    .todo-due.overdue {
      color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color));
    }

    .todo-item.completed .todo-due.overdue {
      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));
    }

    .todo-due-icon {
      --mdc-icon-size: var(--todo-swipe-card-due-icon-size, 14px);
      width: var(--todo-swipe-card-due-icon-size, 14px);
      height: var(--todo-swipe-card-due-icon-size, 14px);
      margin-inline-start: initial;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .todo-item.completed {
      display: flex;
    }

    .todo-card-with-title-wrapper {
      position: relative;
      height: 100%;
      width: 100%;
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, white));
      display: flex;
      flex-direction: column;
    }

    .todo-swipe-card-external-title {
      min-height: var(--todo-swipe-card-title-height, 40px);
      display: flex;
      align-items: center;
      justify-content: var(--todo-swipe-card-title-align, center);
      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));
      color: var(--todo-swipe-card-title-color, var(--primary-text-color));
      font-size: var(--todo-swipe-card-title-font-size, 16px);
      font-weight: var(--todo-swipe-card-title-font-weight, 500);
      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));
      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);
      box-sizing: content-box;
      text-align: var(--todo-swipe-card-title-align, center);
      flex-shrink: 0;
      z-index: 1;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      margin: 0;
      line-height: 1;
      font-family: inherit;
      white-space: var(--todo-swipe-card-title-white-space, nowrap);
      overflow: var(--todo-swipe-card-title-overflow, hidden);
      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);
    }

    .todo-card-container {
      flex: 1;
      min-height: 0;
      position: relative;
    }

    .search-counter {
      padding: 2px 12px 2px 12px;
      margin-left: 4px;
      margin-bottom: 0px; /* Let todo-list top padding provide the 4px gap */
      font-size: var(--todo-swipe-card-search-counter-font-size, 12px);
      color: var(--todo-swipe-card-search-counter-color, var(--secondary-text-color));
      font-style: italic;
      text-align: left;
    }
  `;

  return style;
}

/**
 * Create editor styles
 * @returns {import('lit-element').CSSResult} CSS styles
 */
export const editorStyles = () => css`
  /* Card config container */
  .card-config {
    /* Let HA handle padding */
  }

  /* MAIN SECTION STYLES */
  .section {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(--card-background-color, var(--primary-background-color));
  }

  .section-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

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

  /* Card row styles similar to simple-swipe-card */
  .card-list {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 8px;
    background: var(--secondary-background-color);
  }

  .card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .card-index {
    font-weight: bold;
    margin-right: 10px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .card-type {
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .card-actions ha-icon-button {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .no-cards {
    text-align: center;
    color: var(--secondary-text-color);
    padding: 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 16px;
  }

  .expand-button {
    --mdc-icon-button-size: 32px;
    color: var(--secondary-text-color);
    margin: 0 8px 0 0;
    flex-shrink: 0;
    order: -1;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .expand-button:hover {
    color: #ffc107;
    background-color: rgba(255, 193, 7, 0.1);
  }

  .expand-button[aria-label*='Collapse'] {
    color: #ffc107;
  }

  .card-row:hover .expand-button {
    color: #ffc107;
  }

  .clickable-row {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .clickable-row:hover {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.56);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .clickable-row:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #ffc107;
    border-radius: 0 2px 2px 0;
  }

  .clickable-row.expanded {
    border-color: rgba(255, 193, 7, 0.56);
    background: rgba(255, 193, 7, 0.1);
  }

  .clickable-row.expanded::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #ffc107;
    border-radius: 0 2px 2px 0;
  }

  .clickable-row .card-actions {
    cursor: default;
  }

  .clickable-row .card-actions ha-icon-button {
    cursor: pointer;
  }

  .clickable-row:focus {
    outline: none;
    border-color: rgba(255, 193, 7, 0.56);
    background: rgba(255, 193, 7, 0.1);
  }

  .clickable-row .card-info {
    user-select: none;
  }

  .clickable-row:hover .expand-button {
    color: #ffc107;
    transform: scale(1.05);
  }

  .expanded-content {
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 12px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
  }

  .expanded-content ha-entity-picker {
    width: 100% !important;
    margin-bottom: 12px !important;
    box-sizing: border-box !important;
  }

  .expanded-content ha-select {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .expanded-content ha-textfield {
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  .expanded-content .toggle-option {
    margin: 8px 0 !important;
    padding: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .expanded-content .toggle-option ha-textfield {
    width: 100% !important;
    margin: 8px 0 0 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  ha-formfield {
    display: block;
    padding: 8px 0;
  }

  .expanded-content > div[style*='padding: 8px'] {
    padding: 8px 0 !important;
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
    transition: all 0.3s ease;
  }

  .add-todo-button:hover {
    background-color: var(--secondary-background-color);
  }

  .add-todo-button.blocked {
    background-color: var(--error-color);
    color: white;
    border-color: var(--error-color);
    animation: shake 0.3s ease-in-out;
  }

  .add-todo-button.success {
    background-color: var(--success-color, #4caf50);
    color: white;
    border-color: var(--success-color, #4caf50);
  }

  @keyframes shake {
    0%,
    20%,
    40%,
    60%,
    80% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-3px);
    }
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

  .version-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #24292e;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .github-badge:hover {
    background-color: #444d56;
  }

  .github-badge ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .nested-toggle-option {
    margin-left: 16px;
    padding-left: 8px;
    border-left: 1px solid var(--divider-color);
  }
`;
