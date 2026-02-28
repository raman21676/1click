/**
 * 1click - Main JavaScript Utilities
 * Shared functions used across all games
 */

// ========================================
// Utility Functions
// ========================================

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds limit
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date to local string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// ========================================
// DOM Utilities
// ========================================

/**
 * Select a single element
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {HTMLElement} Selected element
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select multiple elements
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {NodeList} Selected elements
 */
function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag
 * @param {Object} attrs - Attributes object
 * @param {Array} children - Child elements or text
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Add event listener with automatic cleanup tracking
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
function on(element, event, handler, options = {}) {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

// ========================================
// Sound Utilities
// ========================================

/**
 * Simple sound manager
 */
const SoundManager = {
  enabled: true,
  volume: 0.5,
  
  /**
   * Play a beep sound
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in ms
   * @param {string} type - Oscillator type
   */
  playBeep(frequency = 440, duration = 200, type = 'sine') {
    if (!this.enabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  },
  
  /**
   * Play click sound
   */
  playClick() {
    this.playBeep(800, 100, 'sine');
  },
  
  /**
   * Play success sound
   */
  playSuccess() {
    this.playBeep(523, 100, 'sine');
    setTimeout(() => this.playBeep(659, 100, 'sine'), 100);
    setTimeout(() => this.playBeep(784, 200, 'sine'), 200);
  },
  
  /**
   * Play error sound
   */
  playError() {
    this.playBeep(200, 300, 'sawtooth');
  },
  
  /**
   * Toggle sound on/off
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },
  
  /**
   * Set volume
   * @param {number} vol - Volume 0-1
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
};

// ========================================
// Game Utilities
// ========================================

/**
 * Base Game Class
 * All games should extend this class
 */
class BaseGame {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.state = {};
    this.isPlaying = false;
    this.eventListeners = [];
    
    if (!this.container) {
      throw new Error(`Container #${containerId} not found`);
    }
  }
  
  /**
   * Initialize the game
   * Override in subclass
   */
  init() {
    console.log(`${this.constructor.name} initialized`);
  }
  
  /**
   * Start the game
   */
  start() {
    this.isPlaying = true;
    this.emit('start');
  }
  
  /**
   * Pause the game
   */
  pause() {
    this.isPlaying = false;
    this.emit('pause');
  }
  
  /**
   * Resume the game
   */
  resume() {
    this.isPlaying = true;
    this.emit('resume');
  }
  
  /**
   * Reset the game
   */
  reset() {
    this.isPlaying = false;
    this.state = {};
    this.emit('reset');
  }
  
  /**
   * Save game state
   */
  save() {
    // Override in subclass
  }
  
  /**
   * Load game state
   */
  load() {
    // Override in subclass
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    this.eventListeners.forEach(cleanup => cleanup());
    this.eventListeners = [];
    this.emit('destroy');
  }
  
  /**
   * Subscribe to event
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.events) this.events = {};
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  
  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.events && this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// ========================================
// Animation Utilities
// ========================================

/**
 * Animate a number counting up
 * @param {HTMLElement} element - Target element
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Duration in ms
 */
function animateNumber(element, start, end, duration = 1000) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Add shake animation to element
 * @param {HTMLElement} element - Target element
 */
function shakeElement(element) {
  element.classList.add('animate-shake');
  setTimeout(() => element.classList.remove('animate-shake'), 500);
}

// ========================================
// Export for module usage (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    randomInt,
    shuffleArray,
    debounce,
    throttle,
    formatTime,
    formatDate,
    $,
    $$,
    createElement,
    on,
    SoundManager,
    BaseGame,
    animateNumber,
    shakeElement
  };
}
