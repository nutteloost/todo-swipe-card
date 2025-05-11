# Todo Swipe Card

A specialized swipe card for todo lists in Home Assistant with custom styling.

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

## Customizing Appearance

### Background Images

You can set a background image for each todo list with the `background_images` option:

```yaml
background_images:
  todo.shopping_list: /local/images/shopping_bg.jpg
  todo.home_tasks: /local/images/home_bg.jpg
```

### Pagination Dots

The pagination dots use your Home Assistant theme colors by default. You can customize their appearance using card-mod:

```yaml
type: custom:todo-swipe-card
card_mod:
  style: |
    .pagination-dot {
      background-color: rgba(150, 150, 150, 0.6) !important; /* Inactive dots */
      width: 10px !important; /* Size of dots */
      height: 10px !important;
    }
    .pagination-dot.active {
      background-color: red !important; /* Active dot */
    }
entities:
  - todo.shopping_list
  - todo.home_tasks
show_pagination: true
```

## My Other Custom Cards

Check out my other custom cards for Home Assistant:

* [Simple Swipe Card](https://github.com/nutteloost/simple-swipe-card) - A swipeable container card that allows you to add multiple cards and swipe between them
* [Actions Card](https://github.com/nutteloost/actions-card) - Wraps another Home Assistant card to add tap, hold, and double-tap actions

## Support
If you find this card useful, please consider:
* Starring the repository
* Sharing with the community

## License

MIT License
