/**
 * Create pagination element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function createPagination(cardInstance) {
  cardInstance.paginationElement = document.createElement('div');
  cardInstance.paginationElement.className = 'pagination';

  for (let i = 0; i < cardInstance.cards.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'pagination-dot';
    if (i === cardInstance.currentIndex) dot.classList.add('active');

    // Add click handler to dots
    dot.addEventListener('click', () => {
      cardInstance.goToSlide(i);
    });

    cardInstance.paginationElement.appendChild(dot);
  }

  cardInstance.cardContainer.appendChild(cardInstance.paginationElement);

  // Apply pagination styles
  applyPaginationStyles(cardInstance);
}

/**
 * Apply pagination-specific styles from card_mod
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function applyPaginationStyles(cardInstance) {
  if (!cardInstance.paginationElement) return;

  // Extract pagination styling from card_mod
  let paginationStyles = '';

  // Handle string-based card_mod style
  if (
    cardInstance._config.card_mod &&
    cardInstance._config.card_mod.style &&
    typeof cardInstance._config.card_mod.style === 'string'
  ) {
    // Look for our pagination variables in the style string
    const styleString = cardInstance._config.card_mod.style;
    const variablesToExtract = [
      '--todo-swipe-card-pagination-dot-inactive-color',
      '--todo-swipe-card-pagination-dot-active-color',
      '--todo-swipe-card-pagination-dot-size',
      '--todo-swipe-card-pagination-dot-border-radius',
      '--todo-swipe-card-pagination-dot-spacing',
      '--todo-swipe-card-pagination-bottom',
      '--todo-swipe-card-pagination-right',
      '--todo-swipe-card-pagination-background',
      '--todo-swipe-card-pagination-dot-active-size-multiplier',
      '--todo-swipe-card-pagination-dot-active-opacity',
      '--todo-swipe-card-pagination-dot-inactive-opacity'
    ];

    // For each variable, try to extract its value from the style string
    variablesToExtract.forEach((varName) => {
      const regex = new RegExp(`${varName}\\s*:\\s*([^;]+)`, 'i');
      const match = styleString.match(regex);
      if (match && match[1]) {
        paginationStyles += `${varName}: ${match[1].trim()};\n`;
      }
    });
  }

  // If we found pagination styles, apply them directly to the pagination element
  if (paginationStyles) {
    cardInstance.paginationElement.style.cssText += paginationStyles;

    // Get all dots for individual styling
    const dots = cardInstance.paginationElement.querySelectorAll('.pagination-dot');

    // Apply special handling for individual dot properties
    requestAnimationFrame(() => {
      dots.forEach((dot) => {
        // Apply base styles
        dot.style.borderRadius = `var(--todo-swipe-card-pagination-dot-border-radius, 50%)`;
        dot.style.margin = `0 var(--todo-swipe-card-pagination-dot-spacing, 4px)`;

        // Apply size based on active state
        if (dot.classList.contains('active')) {
          dot.style.width = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
          dot.style.height = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
        } else {
          dot.style.width = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
          dot.style.height = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
        }
      });
    });
  }
}

/**
 * Update pagination dots to reflect current slide
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function updatePaginationDots(cardInstance) {
  if (cardInstance.paginationElement) {
    const dots = cardInstance.paginationElement.querySelectorAll('.pagination-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === cardInstance.currentIndex);
    });

    // Apply pagination styles
    applyPaginationStyles(cardInstance);
  }
}
