/**
 * Add swipe gesture handling with touch and mouse support
 *
 * Gesture Detection Strategy:
 * 1. Detect if touch/click starts on interactive elements (inputs, buttons, etc.)
 * 2. Distinguish between scroll intent (vertical) vs swipe intent (horizontal)
 * 3. Only enable drag mode after confirming horizontal swipe intention
 * 4. Apply resistance at card boundaries to prevent overscroll
 *
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
export function addSwipeGestures(cardInstance) {
  // Clean up any existing listeners to prevent duplicates on rebuild
  if (cardInstance._touchStartHandler) {
    cardInstance.cardContainer.removeEventListener('touchstart', cardInstance._touchStartHandler);
    cardInstance.cardContainer.removeEventListener('touchmove', cardInstance._touchMoveHandler);
    cardInstance.cardContainer.removeEventListener('touchend', cardInstance._touchEndHandler);
    cardInstance.cardContainer.removeEventListener('touchcancel', cardInstance._touchEndHandler);
    cardInstance.cardContainer.removeEventListener('mousedown', cardInstance._mouseDownHandler);
    window.removeEventListener('mousemove', cardInstance._mouseMoveHandler);
    window.removeEventListener('mouseup', cardInstance._mouseUpHandler);
  }

  // Gesture state variables
  let startX = 0; // Initial touch/click X position
  let startY = 0; // Initial touch/click Y position
  let currentX = 0; // Current drag X position
  let isDragging = false; // True when actively dragging slides
  let isScrolling = false; // True when user intends to scroll vertically
  let initialTransform = 0; // Starting slider transform value
  let isInteractiveElement = false; // True if gesture started on input/button
  let swipeIntentionConfirmed = false; // True when horizontal intent confirmed

  /**
   * Enhanced interactive element detection
   * Checks element hierarchy to identify inputs, buttons, and other interactive components
   * NOTE: Does NOT block scrollable elements - scroll vs swipe is determined dynamically
   *
   * @param {Element} element - Element to check
   * @returns {boolean} True if element is interactive
   */
  cardInstance._isInteractiveOrScrollable = (element) => {
    if (
      !element ||
      element === cardInstance.cardContainer ||
      element === cardInstance.sliderElement
    )
      return false;

    let current = element;
    let depth = 0;

    // Walk up the DOM tree to check for interactive elements
    while (current && depth < 15) {
      try {
        if (current.nodeType === Node.ELEMENT_NODE) {
          const tagName = current.localName?.toLowerCase();
          const role = current.getAttribute && current.getAttribute('role');

          // Check for interactive HTML tags
          const interactiveTags = [
            'input',
            'textarea',
            'select',
            'button',
            'a',
            'ha-switch',
            'ha-checkbox',
            'mwc-checkbox',
            'paper-checkbox',
            'ha-textfield',
            'ha-slider',
            'paper-slider',
            'ha-icon-button',
            'mwc-button',
            'paper-button'
          ];

          if (interactiveTags.includes(tagName)) {
            return true;
          }

          // Check ARIA roles for interactive elements
          if (
            role &&
            [
              'button',
              'checkbox',
              'switch',
              'slider',
              'link',
              'menuitem',
              'textbox',
              'input',
              'combobox',
              'searchbox'
            ].includes(role)
          ) {
            return true;
          }

          // Check for Material Design Component classes
          if (current.classList) {
            const mdcClasses = [
              'mdc-text-field',
              'mdc-text-field__input',
              'mdc-text-field__ripple',
              'mdc-line-ripple',
              'mdc-floating-label',
              'mdc-text-field__affix'
            ];
            for (const className of mdcClasses) {
              if (current.classList.contains(className)) {
                return true;
              }
            }
          }
        }
      } catch (e) {
        break; // Exit on any DOM traversal errors
      }

      // Move up the DOM tree (handle shadow DOM and slots)
      current =
        current.assignedSlot ||
        current.parentNode ||
        (current.getRootNode && current.getRootNode().host);
      depth++;
    }

    return false;
  };

  /**
   * Handle gesture start (touchstart/mousedown)
   * Determines if this gesture should be processed and initializes tracking
   */
  cardInstance._handleSwipeStart = (e) => {
    // Ignore non-primary mouse buttons or if already dragging
    if (isDragging || (e.type === 'mousedown' && e.button !== 0)) return;

    // CRITICAL: Check for interactive elements first - if found, skip ALL swipe processing
    isInteractiveElement = cardInstance._isInteractiveOrScrollable(e.target);
    if (isInteractiveElement) {
      return; // Exit immediately for inputs, buttons, etc.
    }

    // Initialize gesture state (but don't start dragging yet)
    isDragging = false;
    isScrolling = false;
    swipeIntentionConfirmed = false;

    // Record starting position
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    currentX = startX;

    // Capture initial slider position for relative dragging
    if (cardInstance.sliderElement) {
      const style = window.getComputedStyle(cardInstance.sliderElement);
      const matrix = new DOMMatrixReadOnly(style.transform);
      initialTransform = matrix.m41; // X translation value
    }

    // For mouse events, add window listeners to track movement outside element
    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', cardInstance._mouseMoveHandler);
      window.addEventListener('mouseup', cardInstance._mouseUpHandler);
    }
  };

  /**
   * Handle gesture movement (touchmove/mousemove)
   * Determines scroll vs swipe intention and handles drag calculations
   */
  cardInstance._handleSwipeMove = (e) => {
    // Skip if gesture started on interactive element
    if (isInteractiveElement) return;

    let clientX, clientY;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const moveX = clientX - startX;
    const moveY = clientY - startY;

    // INTENTION DETECTION: Determine if user wants to scroll or swipe
    if (!isScrolling && !swipeIntentionConfirmed) {
      // Vertical movement dominates = user wants to scroll
      if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 15) {
        isScrolling = true;
        return; // Let browser handle scrolling
      }
      // Horizontal movement dominates = user wants to swipe
      else if (Math.abs(moveX) > 15) {
        swipeIntentionConfirmed = true;
        isDragging = true;

        // NOW we commit to swipe mode - disable transitions and set cursor
        if (cardInstance.sliderElement) {
          cardInstance.sliderElement.style.transition = 'none';
          cardInstance.sliderElement.style.cursor = 'grabbing';
        }

        // Prevent default scrolling behavior
        if (e.cancelable) {
          e.preventDefault();
        }
      } else {
        // Movement too small - keep monitoring
        return;
      }
    }

    // Skip processing if user is scrolling
    if (isScrolling || !swipeIntentionConfirmed) return;

    // Prevent browser default behaviors for confirmed swipes
    if (e.cancelable) {
      e.preventDefault();
    }

    currentX = clientX;

    // DRAG CALCULATION with boundary resistance
    let totalDragOffset = currentX - startX;

    // Apply resistance at edges to prevent overscroll
    const atLeftEdge = cardInstance.currentIndex === 0;
    const atRightEdge = cardInstance.currentIndex === cardInstance.cards.length - 1;

    if ((atLeftEdge && totalDragOffset > 0) || (atRightEdge && totalDragOffset < 0)) {
      const overDrag = Math.abs(totalDragOffset);
      // Exponential resistance curve - more resistance as user drags further
      const resistanceFactor = 0.3 + 0.7 / (1 + overDrag / (cardInstance.slideWidth * 0.5));
      totalDragOffset *= resistanceFactor * 0.5;
    }

    // Apply transform using requestAnimationFrame for smooth performance
    const newTransform = initialTransform + totalDragOffset;
    if (cardInstance.sliderElement) {
      requestAnimationFrame(() => {
        cardInstance.sliderElement.style.transform = `translateX(${newTransform}px)`;
      });
    }
  };

  /**
   * Handle gesture end (touchend/mouseup/touchcancel)
   * Determines if drag was significant enough to change slides and animates to final position
   */
  cardInstance._handleSwipeEnd = (e) => {
    // Clean up window event listeners for mouse events
    if (e.type === 'mouseup' || e.type === 'mouseleave') {
      window.removeEventListener('mousemove', cardInstance._mouseMoveHandler);
      window.removeEventListener('mouseup', cardInstance._mouseUpHandler);
    }

    // Skip if gesture started on interactive element
    if (isInteractiveElement) {
      isInteractiveElement = false;
      return;
    }

    const wasDragging = isDragging;

    // Reset all gesture state
    isDragging = false;
    isScrolling = false;
    swipeIntentionConfirmed = false;
    isInteractiveElement = false;

    // Restore normal slider behavior
    if (cardInstance.sliderElement) {
      const transitionSpeed = cardInstance._transitionSpeed || '0.3s';
      const transitionEasing = cardInstance._transitionEasing || 'ease-out';
      cardInstance.sliderElement.style.transition = `transform ${transitionSpeed} ${transitionEasing}`;
      cardInstance.sliderElement.style.cursor = '';
    }

    // Only process slide change if we were actually dragging and it wasn't cancelled
    if (!wasDragging || e.type === 'touchcancel') {
      cardInstance.updateSlider(); // Snap back to current position
      return;
    }

    // SLIDE CHANGE LOGIC: Check if drag distance exceeds threshold
    const totalMoveX = currentX - startX;
    const threshold = cardInstance.slideWidth * 0.2; // 20% of slide width

    if (Math.abs(totalMoveX) > threshold) {
      // Drag right and not at first slide = go to previous slide
      if (totalMoveX > 0 && cardInstance.currentIndex > 0) {
        cardInstance.currentIndex--;
      }
      // Drag left and not at last slide = go to next slide
      else if (totalMoveX < 0 && cardInstance.currentIndex < cardInstance.cards.length - 1) {
        cardInstance.currentIndex++;
      }
    }

    // Animate to final position
    cardInstance.updateSlider(true);
  };

  // Store bound handlers for cleanup
  cardInstance._touchStartHandler = cardInstance._handleSwipeStart.bind(cardInstance);
  cardInstance._touchMoveHandler = cardInstance._handleSwipeMove.bind(cardInstance);
  cardInstance._touchEndHandler = cardInstance._handleSwipeEnd.bind(cardInstance);
  cardInstance._mouseDownHandler = cardInstance._handleSwipeStart.bind(cardInstance);
  cardInstance._mouseMoveHandler = cardInstance._handleSwipeMove.bind(cardInstance);
  cardInstance._mouseUpHandler = cardInstance._handleSwipeEnd.bind(cardInstance);

  // Attach event listeners
  cardInstance.cardContainer.addEventListener('touchstart', cardInstance._touchStartHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('touchmove', cardInstance._touchMoveHandler, {
    passive: false
  });
  cardInstance.cardContainer.addEventListener('touchend', cardInstance._touchEndHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('touchcancel', cardInstance._touchEndHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('mousedown', cardInstance._mouseDownHandler);
}
