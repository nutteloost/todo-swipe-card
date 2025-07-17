import { VERSION } from './utils/Constants.js';
import { debugLog } from './utils/Debug.js';
import { TodoSwipeCard } from './core/TodoSwipeCard.js';
import { TodoSwipeCardEditor } from './core/TodoSwipeCardEditor.js';

// Define custom elements
customElements.define('todo-swipe-card', TodoSwipeCard);
customElements.define('todo-swipe-card-editor', TodoSwipeCardEditor);

// Add card to UI picker
if (!window.customCards) {
  window.customCards = [];
}

// Ensure registration happens only once
let registered = window.customCards.some((card) => card.type === 'todo-swipe-card');
if (!registered) {
  window.customCards.push({
    type: 'todo-swipe-card',
    name: 'Todo Swipe Card',
    preview: true, // Enable preview
    description: 'A specialized swipe card for to-do lists'
  });
  debugLog('Todo Swipe Card registered in customCards');
}

// Version logging
console.info(
  `%c TODO-SWIPE-CARD %c v${VERSION} %c - A swipeable card for to-do lists`,
  'color: white; background: #4caf50; font-weight: 700;',
  'color: #4caf50; background: white; font-weight: 700;',
  'color: grey; background: white; font-weight: 400;'
);

// Export main classes for potential external use
export { TodoSwipeCard, TodoSwipeCardEditor };
