# Todo Swipe Card

[![Github All Releases](https://img.shields.io/github/downloads/nutteloost/todo-swipe-card/total.svg)]()
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![Reddit Profile](https://img.shields.io/badge/Reddit-My%20stuff-orange?logo=reddit)](https://www.reddit.com/user/nutteloost/submitted/)
[![Home Assistant Community Forum](https://img.shields.io/badge/Home%20Assistant-Community%20Forum-blue?logo=home-assistant)](https://community.home-assistant.io/t/simple-swipe-card-a-custom-card-for-easy-card-navigation/888415)

A specialized swipe card for todo lists in Home Assistant with custom styling.

> ⚠ **Important**: This card requires [card-mod](https://github.com/thomasloven/lovelace-card-mod) to be installed and working properly. Make sure to install card-mod from HACS before using Todo Swipe Card.

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

## Requirements
- Home Assistant 2023.4 or later
- [Card-Mod](https://github.com/thomasloven/lovelace-card-mod) installed and configured

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
- Display order setting of todo list items per list
- Display options for completed items, add buttons, and more
- Real-time preview of changes
- Auto-Migration button for deprecated configurations

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


### Entity Configuration Options
| Name | Type | Default | Description |
|------|------|---------|-------------|
| entity | string | Required | Todo list entity ID |
| show_title | boolean | false | Show custom title above todo list |
| title | string | Optional | Custom title text (Only used if show_title is true) |
| background_image | string | Optiona; | Background image URL for this entity |
| display_order | string | none | Sort order: `none`, `alpha_asc`, `alpha_desc`, `duedate_asc`, `duedate_desc` |


### Example Configuration

#### Simple configuration
```yaml
type: custom:todo-swipe-card
entities:
  - todo.shopping_list
  - todo.home_tasks
  - todo.work_projects
show_pagination: true
show_completed: true
card_spacing: 15
```

#### Advanced Configuration 

```yaml
type: custom:todo-swipe-card
entities:
  - entity: todo.shopping_list
    background_image: /local/images/shopping_bg.jpg
    show_title: true
    title: "Shopping List"
    display_order: alpha_asc
  - entity: todo.home_tasks
    background_image: /local/images/home_bg.jpg
    show_title: true
    title: "Home Tasks"
    display_order: duedate_asc
  - entity: todo.work_projects
    display_order: none
show_pagination: true
show_addbutton: true
show_create: true
show_completed: true
show_completed_menu: true
delete_confirmation: true
card_spacing: 10
```


## Migration from v1.x

If you're upgrading from v1.x, your existing configuration will partially work, but you'll see a migration warning in the visual editor and you should upgrade to the new format. If you click on the 'Auto-Migrate Configuration' button, your (yaml) configuration will automatically update to the new format. 

<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/auto-migration-configuration.png" width="400" alt="Example">

### Using Visual Editor (Recommended)
1. Open the card in edit mode
2. You'll see a migration warning at the top
3. Click "Auto-Migrate Configuration" to instantly convert to the new format
4. Save the card

<details>
<summary><strong>Manual Migration (Click to expand)</strong></summary>

### Manual Migration
Convert your old global configuration to the new entity-centric format:

**Old Format:**
```yaml
entities:
  - todo.shopping_list
  - todo.home_tasks
background_images:
  todo.shopping_list: /local/images/shopping_bg.jpg
show_titles:
  todo.shopping_list: true
entity_titles:
  todo.shopping_list: "My Shopping"
display_orders:
  todo.shopping_list: alpha_asc
```

New Format:
```yaml
entities:
  - entity: todo.shopping_list
    background_image: /local/images/shopping_bg.jpg
    show_title: true
    title: "My Shopping"
    display_order: alpha_asc
  - entity: todo.home_tasks
```
</details>



## Customizing and Theming
> ⚠ **Important**: This card requires [card-mod](https://github.com/thomasloven/lovelace-card-mod) to be installed and working properly. Please note that since Todo Swipe Card applies internal card-mod styling for core functionality, some custom styling may conflict or behave unexpectedly. Test your customizations thoroughly and use CSS specificity or `!important` declarations when necessary.

The Todo Swipe Card provides extensive customization capabilities through two primary methods: Home Assistant themes and card-mod styling. The card supports over fourty CSS variables that control every aspect of its appearance, from basic colors and typography to sophisticated pagination styling and transition effects.

**Simplified Customization Approach**: Todo Swipe Card includes CSS variables that make customization much easier compared to traditional card-mod styling. Instead of having to figure out complex CSS selectors or inspect the card's internal structure, you can simply use these predefined variables to customize colors, sizes, and other visual elements. This means you can create great-looking themes without needing to be a CSS expert or spending time hunting down the right selectors to target specific elements.

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
      # Add any other variables from the complete CSS reference
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
/* Core Appearance */
--todo-swipe-card-background:                           /* Main card background color or gradient */
--todo-swipe-card-text-color:                           /* Primary text color for all todo items, excluding descriptions and due dates */

/* Typography and Layout */
--todo-swipe-card-font-size:                            /* Base font size for todo items (default: 11px) */
--todo-swipe-card-font-size-due-date:                   /* Font size for due dates and associated icon (default: 11px) */
--todo-swipe-card-font-color-description:               /* Color of the description text of todo items */
--todo-swipe-card-font-color-due-date:                  /* Color of the due dates and associated icon */
--todo-swipe-card-font-color-due-date-overdue:          /* Color of overdue due dates text and associated icon */
--todo-swipe-card-item-height:                          /* Minimum height of individual todo items (default: 0px) */
--todo-swipe-card-item-margin:                          /* Spacing between checkbox and todo item text (default: 5px) */

/* Item Spacing and Line Height */
--todo-swipe-card-line-height:                          /* Line height for main todo text when it wraps to multiple lines (default: 1.4) */
--todo-swipe-card-item-spacing:                         /* Consistent margin between todo items (default: 8px) */
--todo-swipe-card-description-margin-top:               /* Space above description text (default: 2px) */
--todo-swipe-card-due-date-margin-top:                  /* Space above due date (default: 4px) */

/* Title Styling */
--todo-swipe-card-title-height:                         /* Height of entity titles (default: 40px) */
--todo-swipe-card-title-background:                     /* Background color of entity titles */
--todo-swipe-card-title-color:                          /* Text color of entity titles */
--todo-swipe-card-title-font-size:                      /* Font size of entity titles (default: 16px) */
--todo-swipe-card-title-font-weight:                    /* Font weight of entity titles (default: 500) */
--todo-swipe-card-title-border-color:                   /* Border color below entity titles */
--todo-swipe-card-title-border-width:                   /* Border width below entity titles (default: 1px) */
--todo-swipe-card-title-padding-horizontal:             /* Horizontal padding of entity titles (default: 16px) */
--todo-swipe-card-title-justify:                        /* Title alignment: flex-start, center, flex-end (default: center) */

/* Checkbox Styling */
--todo-swipe-card-checkbox-color:                        /* Color of unchecked checkboxes, use rgba values to also control opacity (rgba(255, 0, 0, 0.6);) */
--todo-swipe-card-checkbox-checked-color:                /* Color of checked checkboxes (default: var(--primary-color)) */
--todo-swipe-card-checkbox-checkmark-color:              /* Color of the checkmark inside checked boxes */
--todo-swipe-card-checkbox-size:                         /* Size of checkbox elements (default: 20px) */

/* Input Field Styling */
--todo-swipe-card-placeholder-color:                     /* Color of 'Add item' text in input fields */
--todo-swipe-card-placeholder-opacity:                   /* Opacity of 'Add item' text (default: 1) */

/* Pagination Customization */
--todo-swipe-card-pagination-dot-size:                   /* Diameter of pagination dots (default: 8px) */
--todo-swipe-card-pagination-dot-active-color:           /* Color of the currently active pagination dot */
--todo-swipe-card-pagination-dot-inactive-color:         /* Color of inactive pagination dots */
--todo-swipe-card-pagination-dot-spacing:                /* Horizontal space between pagination dots (default: 4px) */
--todo-swipe-card-pagination-dot-border-radius:          /* Border radius of pagination dots (default: 50%) */
--todo-swipe-card-pagination-dot-active-size-multiplier: /* Size multiplier for active dots (default: 1) */
--todo-swipe-card-pagination-bottom:                     /* Distance of pagination from bottom edge (default: 8px) */
--todo-swipe-card-pagination-background:                 /* Background color of the pagination area */
--todo-swipe-card-pagination-dot-active-opacity:         /* Opacity of active pagination dot (default: 1) */
--todo-swipe-card-pagination-dot-inactive-opacity:       /* Opacity of inactive pagination dot (default: 0.6) */

/* Animation and Transitions */
--todo-swipe-card-transition-speed:                      /* Duration of swipe animations (default: 0.3s) */
--todo-swipe-card-transition-easing:                     /* Easing function for transitions (default: ease-out) */

/* Interactive Elements */
--todo-swipe-card-delete-button-top:                     /* Manual positioning of delete button from top */
--todo-swipe-card-delete-button-color:                   /* Color of the delete completed items button */
--todo-swipe-card-add-button-color:                      /* Color of the add item button */
```

### Styling Examples

#### Example 1

<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/todo-swipe-card_example_advanced.png" style="width: 100%;max-width: 320px;" alt="Example 1">

<details>
<summary><strong>Example 1 (Advanced) Configuration:</strong></summary>

```yaml
type: custom:todo-swipe-card
entities:
  - entity: todo.shipping_list
    show_title: true
    title: 🛒 Shopping List
    display_order: alpha_asc
  - entity: todo.work_projects
    show_title: true
    title: 💼 Work Projects
    display_order: duedate_desc
card_spacing: 10
show_pagination: true
show_create: true
show_addbutton: true
show_completed: true
show_completed_menu: true
delete_confirmation: true
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --todo-swipe-card-text-color: #ffffff;
      --todo-swipe-card-item-spacing: 8px;   

      /* Typography */
      --todo-swipe-card-font-size: 11px;
      --todo-swipe-card-font-size-due-date: 10px;
      
      /* Title styling - left aligned */
      --todo-swipe-card-title-height: 35px;
      --todo-swipe-card-title-background: linear-gradient(135deg, #667eea 0%, #764ba2 10%);
      --todo-swipe-card-title-color: #ffffff;
      --todo-swipe-card-title-font-size: 18px;
      --todo-swipe-card-title-font-weight: 400;
      --todo-swipe-card-title-justify: flex-start;
      --todo-swipe-card-title-border-color: rgba(255, 255, 255, 0.2);
      --todo-swipe-card-title-border-width: 3px;
      
      /* Due date styling */
      --todo-swipe-card-font-color-due-date: rgba(255, 255, 255, 0.8);
      --todo-swipe-card-font-color-due-date-overdue: #ff6b6b;
      --todo-swipe-card-font-color-description: rgba(255, 255, 255, 0.7);

      /* Tighter line spacing */
      --todo-swipe-card-line-height: 1.2;
      --todo-swipe-card-description-margin-top: 2px;
      --todo-swipe-card-due-date-margin-top: 1px;
      
      /* Modern checkbox styling */
      --todo-swipe-card-checkbox-color: rgba(255, 255, 255, 0.3);
      --todo-swipe-card-checkbox-checked-color: #4ecdc4;
      --todo-swipe-card-checkbox-checkmark-color: #ffffff;
      --todo-swipe-card-checkbox-size: 22px;
      
      /* Input field styling */
      --todo-swipe-card-placeholder-color: rgba(255, 255, 255, 0.7);
      --todo-swipe-card-placeholder-opacity: 0.5;
      
      /* Interactive elements */
      --todo-swipe-card-add-button-color: #4ecdc4;
      --todo-swipe-card-delete-button-color: #ff6b6b;
      
      /* Pagination Dots */
      --todo-swipe-card-pagination-dot-size: 10px;
      --todo-swipe-card-pagination-dot-active-color: #4ecdc4;
      --todo-swipe-card-pagination-dot-inactive-color: rgba(255, 255, 255, 0.4);
      --todo-swipe-card-pagination-dot-spacing: 2px;
      --todo-swipe-card-pagination-bottom: 12px;
      --todo-swipe-card-pagination-dot-active-size-multiplier: 1.5;
    }
```
</details>


#### Example 2

<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/todo-swipe-card_example_1.png" style="width: 100%; max-width: 320px;" alt="Example 2">

<details>
<summary><strong>Example 2 Configuration</strong></summary>

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: #fafafa;
      --todo-swipe-card-text-color: #212121;
      --todo-swipe-card-font-size: 13px;
      --todo-swipe-card-font-size-due-date: 10px;
      --todo-swipe-card-item-margin: 6px;
      
      --todo-swipe-card-checkbox-color: rgba(97, 97, 97, 0.3);
      --todo-swipe-card-checkbox-checked-color: transparent;
      --todo-swipe-card-checkbox-checkmark-color: transparent;
      
      --todo-swipe-card-field-line-color: #e0e0e0;
      --todo-swipe-card-placeholder-color: #757575;
      --todo-swipe-card-add-button-color: #4caf50;
      --todo-swipe-card-delete-button-color: red;
      
      --todo-swipe-card-pagination-dot-size: 8px;
      --todo-swipe-card-pagination-dot-border-radius: 1px;
      --todo-swipe-card-pagination-dot-active-color: #4caf50;
      --todo-swipe-card-pagination-dot-spacing: 6px;
      --todo-swipe-card-pagination-bottom: 10px;
      
      --todo-swipe-card-transition-speed: 0.25s;
      --todo-swipe-card-transition-easing: ease-out;
    }
```
</details>

#### Example 3

<img src="https://raw.githubusercontent.com/nutteloost/todo-swipe-card/main/images/todo-swipe-card_example_2.png" style="width: 100%; max-width: 320px;" alt="Example 3">

<details>
<summary><strong>Example 3 Configuration</strong></summary>

```yaml
card_mod:
  style: |
    :host {
      --todo-swipe-card-background: pink;
      --todo-swipe-card-text-color: grey;
      --todo-swipe-card-font-size: 16px;

      --todo-swipe-card-checkbox-color: rgba(255, 0, 0, 0.75);
      --todo-swipe-card-checkbox-checked-color: green;
      --todo-swipe-card-checkbox-checkmark-color: purple;

      --todo-swipe-card-pagination-dot-spacing: 13px;
      --todo-swipe-card-pagination-dot-active-color: green;
      
      --todo-swipe-card-add-button-color: purple;
      --todo-swipe-card-delete-button-color: purple;
    }
```
</details>

### My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Simple Swipe Card](https://github.com/nutteloost/simple-swipe-card) - A swipeable container card that allows you to add multiple cards and swipe between them
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions
