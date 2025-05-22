# Todo Swipe Card

A specialized swipe card for todo lists in Home Assistant with custom styling.

> **Important**: This card requires [card-mod](https://github.com/thomasloven/lovelace-card-mod) to be installed and working properly. Make sure to install card-mod from HACS before using Todo Swipe Card.

<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/todo-swipe-card-example.gif" width="400" alt="Example">

Todo Swipe Card is a customizable container card for Home Assistant specifically designed for to-do lists. It allows you to place multiple to-do lists in a single space and navigate between them with intuitive swipe gestures. The card features built-in styling for a clean, modern look and optimizes dashboard space by grouping related to-do lists together. With mobile-friendly touch and mouse navigation, pagination indicators, adjustable card spacing, and customizable background images, Todo Swipe Card enhances both functionality and user experience with minimal configuration.

## Features
- Swipe between multiple to-do lists
- Built-in styling with customizable background images
- Pagination dots
- Configurable card spacing
- Options to show/hide completed items
- Delete completed items button with optional confirmation dialog
- Visual editor support
- Requires [card-mod](https://github.com/thomasloven/lovelace-card-mod) to be installed

## Installation
 
### HACS (Recommended)
1. Open HACS
2. Go to "Frontend" section
3. Click on the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/nutteloost/todo-swipe-card`
6. Click "Add"
7. Search for "Todo Swipe Card" and install it
8. Make sure you have [card-mod](https://github.com/thomasloven/lovelace-card-mod) installed as well

### Manual Installation
1. Download `todo-swipe-card.js` from the latest release
2. Copy it to `config/www/todo-swipe-card/todo-swipe-card.js`
3. Add the following to your configuration.yaml:
   ```yaml
   lovelace:
     resources:
       - url: /local/todo-swipe-card/todo-swipe-card.js
         type: module
   ```
4. Ensure you have card-mod installed
5. Restart Home Assistant

## Visual Editor

The Todo Swipe Card includes a visual editor that appears when you add or edit the card through the Home Assistant UI. Features include:
- Add/remove to-do lists
- Visual toggle for pagination dots
- Simple number input for card spacing
- Background image configuration for each to-do list
- Display options for completed items, add buttons, and more
- Real-time preview of changes

#### Search for 'Todo Swipe Card'
<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/visual_editor_search.png" width="250">

#### Edit the card
<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/visual_editor_card_editor.png" width="750">

## Configuration
This card can be configured using the visual editor or YAML.

### Options
| Name | Type | Default | Description |
|------|------|---------|-------------|
| entities | list | Required | List of todo entities to display |
| show_pagination | boolean | true | Show/hide pagination dots |
| show_addbutton | boolean | false | Show/hide the "+" button next to the add field |
| show_create | boolean | true | Show/hide the add item input field |
| show_completed | boolean | false | Show/hide completed items |
| show_completed_menu | boolean | false | Show/hide delete completed items button |
| delete_confirmation | boolean | false | Show confirmation dialog when deleting completed items |
| card_spacing | number | 15 | Space between cards in pixels |
| background_images | object | {} | Object mapping entity IDs to background image URLs |

### Example Configuration
```yaml
type: custom:todo-swipe-card
entities:
  - todo.shopping_list
  - todo.home_tasks
  - todo.work_projects
show_pagination: true
show_addbutton: true
show_create: true
show_completed: true
show_completed_menu: true
delete_confirmation: true
card_spacing: 15
background_images:
  todo.shopping_list: /local/images/shopping_bg.jpg
  todo.home_tasks: /local/images/home_bg.jpg
```

## Customizing and Theming
Todo Swipe Card v1.6.0 provides extensive customization capabilities through two primary methods: Home Assistant themes and card-mod styling. The card supports over twenty CSS variables that control every aspect of its appearance, from basic colors and typography to sophisticated pagination styling and transition effects.

When combining theme-based styling with card-mod overrides, remember that card-mod styles take precedence over theme variables. This hierarchy allows you to establish baseline styling through themes while maintaining the flexibility to customize individual card instances as needed.

### Method 1: Home Assistant Themes
Create or modify a theme in your Home Assistant configuration to apply styling across all instances of the Todo Swipe Card. This method is ideal for consistent styling throughout your dashboard.

Add the following to your `configuration.yaml`:

```yaml
frontend:
  themes:
    todo_custom_theme:
      # Your existing theme variables
      primary-color: "#3498db"
      # Todo Swipe Card specific variables
      todo-swipe-card-text-color: "#2c3e50"
      todo-swipe-card-pagination-dot-active-color: "#e74c3c"
```

### Method 2: Card-Mod Styling

Apply styling directly to individual card instances using card-mod. This method provides maximum flexibility and allows for unique styling of specific cards.

```yaml
type: custom:todo-swipe-card
entities:
  - todo.shopping_list
card_mod:
  style: |
    :host {
      --todo-swipe-card-text-color: #ffffff;
      --todo-swipe-card-background: linear-gradient(45deg, #667eea, #764ba2);
    }
```

### Complete CSS Variables Reference

```yaml
# Core Appearance
--todo-swipe-card-background:       // Main card background color or gradient
--todo-swipe-card-text-color:       // Primary text color for all content including items and placeholders
--todo-swipe-card-primary-color:    // Primary accent color used throughout the card

# Typography and Layout
--todo-swipe-card-typography-size   // Base font size for todo items (default: 11px)
--todo-swipe-card-item-height       // Minimum height of individual todo items (default: 0px)
--todo-swipe-card-item-margin       // Spacing between checkbox and todo item text (default: 5px)

# Checkbox Styling
--todo-swipe-card-checkbox-color    // Color of checkboxes in both checked and unchecked states
--todo-swipe-card-checkbox-size     // Size of checkbox elements (default: 20px)
--todo-swipe-card-checkbox-opacity  // Transparency level of checkboxes (default: 0.85)

# Input Field Styling
--todo-swipe-card-field-line-color: // Color of input field borders and underlines (default: grey)

# Pagination Customization
--todo-swipe-card-pagination-dot-size           // Diameter of pagination dots (default: 8px)
--todo-swipe-card-pagination-dot-active-color   // Color of the currently active pagination dot
--todo-swipe-card-pagination-dot-inactive-color // Color of inactive pagination dots
--todo-swipe-card-pagination-dot-spacing        // Horizontal space between pagination dots (default: 4px)
--todo-swipe-card-pagination-dot-border-radius  // Border radius of pagination dots (default: 50%)
--todo-swipe-card-pagination-dot-active-size-multiplier  // Size multiplier for active dots (default: 1)
--todo-swipe-card-pagination-bottom             // Distance of pagination from bottom edge (default: 8px)
--todo-swipe-card-pagination-background         // Background color of the pagination area

# Animation and Transitions
--todo-swipe-card-transition-speed    // Duration of swipe animations (default: 0.3s)
--todo-swipe-card-transition-easing   // Easing function for transitions (default: ease-out)

# Interactive Elements
--todo-swipe-card-delete-button-color // Color of the delete completed items button
```

### Styling Examples

#### Example 1: Large Text with High Contrast
This configuration creates a bold, accessible design with enlarged text and high contrast colors suitable for users with visual impairments or those who prefer larger interface elements.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-text-color: #000000;
      --todo-swipe-card-background: #f8f9fa;
      --todo-swipe-card-typography-size: 18px;
      --todo-swipe-card-item-height: 50px;
      --todo-swipe-card-checkbox-size: 28px;
      --todo-swipe-card-primary-color: #007bff;
    }
```

#### Example 2: Dark Theme with Colored Accents
A sophisticated dark theme with vibrant accent colors that creates an elegant, modern appearance perfect for evening use or dark dashboard themes.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: #1a1a1a;
      --todo-swipe-card-text-color: #e0e0e0;
      --todo-swipe-card-primary-color: #bb86fc;
      --todo-swipe-card-checkbox-color: #03dac6;
      --todo-swipe-card-field-line-color: #bb86fc;
      --todo-swipe-card-delete-button-color: #cf6679;
    }
```

#### Example 3: Custom Pagination with Unique Positioning
This example demonstrates advanced pagination customization with rectangular dots positioned at the top of the card, featuring distinctive sizing for active states.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-pagination-dot-size: 10px;
      --todo-swipe-card-pagination-dot-border-radius: 2px;
      --todo-swipe-card-pagination-dot-active-color: #ff6b6b;
      --todo-swipe-card-pagination-dot-inactive-color: rgba(255, 255, 255, 0.3);
      --todo-swipe-card-pagination-dot-spacing: 8px;
      --todo-swipe-card-pagination-dot-active-size-multiplier: 1.5;
      --todo-swipe-card-pagination-bottom: auto;
      --todo-swipe-card-pagination-background: rgba(0, 0, 0, 0.1);
    }
    .pagination {
      top: 8px !important;
      bottom: auto !important;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 15px;
      padding: 4px 8px;
    }
```

#### Example 4: Smooth Animation with Gradient Background
A visually striking configuration featuring smooth, slow animations combined with an eye-catching gradient background that creates a premium, polished appearance.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      --todo-swipe-card-text-color: #ffffff;
      --todo-swipe-card-transition-speed: 0.8s;
      --todo-swipe-card-transition-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      --todo-swipe-card-checkbox-color: #ffffff;
      --todo-swipe-card-checkbox-opacity: 0.9;
      --todo-swipe-card-pagination-dot-active-color: #ffd700;
      --todo-swipe-card-pagination-dot-inactive-color: rgba(255, 255, 255, 0.6);
    }
```

#### Example 5: Minimalist Design with Precise Spacing
A clean, minimalist approach that emphasizes content over decoration, featuring precise spacing control and subtle color choices for a professional appearance.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: #ffffff;
      --todo-swipe-card-text-color: #2c3e50;
      --todo-swipe-card-typography-size: 14px;
      --todo-swipe-card-item-height: 40px;
      --todo-swipe-card-item-margin: 12px;
      --todo-swipe-card-checkbox-size: 18px;
      --todo-swipe-card-checkbox-color: #34495e;
      --todo-swipe-card-field-line-color: #bdc3c7;
      --todo-swipe-card-pagination-dot-size: 6px;
      --todo-swipe-card-pagination-dot-active-color: #3498db;
      --todo-swipe-card-pagination-dot-inactive-color: #ecf0f1;
    }
```

#### Example 6: Retro Gaming Theme
A playful retro-inspired theme with bold colors and distinctive styling that evokes classic gaming interfaces, perfect for entertainment-focused dashboards.

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: #0f0f23;
      --todo-swipe-card-text-color: #00ff00;
      --todo-swipe-card-typography-size: 16px;
      --todo-swipe-card-primary-color: #00ff00;
      --todo-swipe-card-checkbox-color: #ffff00;
      --todo-swipe-card-field-line-color: #00ff00;
      --todo-swipe-card-pagination-dot-size: 8px;
      --todo-swipe-card-pagination-dot-border-radius: 0px;
      --todo-swipe-card-pagination-dot-active-color: #ff00ff;
      --todo-swipe-card-pagination-dot-inactive-color: #404040;
      --todo-swipe-card-transition-speed: 0.1s;
      --todo-swipe-card-transition-easing: steps(4, end);
    }
```


## My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Simple Swipe Card](https://github.com/nutteloost/simple-swipe-card) - A swipeable container card that allows you to add multiple cards and swipe between them
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions
