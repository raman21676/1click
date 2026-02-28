/**
 * 1click - LocalStorage Manager
 * Handles all persistent storage operations
 */

// ========================================
// Storage Keys
// ========================================

const STORAGE_KEYS = {
  // Global Settings
  THEME: '1click_theme',
  LANGUAGE: '1click_lang',
  SOUND_ENABLED: '1click_sound',
  VIBRATION_ENABLED: '1click_vibration',
  
  // High Scores
  HIGH_SCORES: '1click_scores',
  
  // Game Progress
  GAME_PROGRESS: '1click_progress',
  
  // User Stats
  USER_STATS: '1click_stats',
  
  // Achievements
  ACHIEVEMENTS: '1click_achievements',
  
  // Version (for migrations)
  VERSION: '1click_version'
};

// Current storage version
const CURRENT_VERSION = '1.0.0';

// ========================================
// Storage Manager
// ========================================

const StorageManager = {
  /**
   * Initialize storage
   */
  init() {
    // Check version and migrate if needed
    const version = this.get(STORAGE_KEYS.VERSION);
    if (version !== CURRENT_VERSION) {
      this.migrate(version);
    }
    
    // Set defaults if not present
    if (!this.has(STORAGE_KEYS.THEME)) {
      this.set(STORAGE_KEYS.THEME, 'light');
    }
    if (!this.has(STORAGE_KEYS.SOUND_ENABLED)) {
      this.set(STORAGE_KEYS.SOUND_ENABLED, true);
    }
    if (!this.has(STORAGE_KEYS.VIBRATION_ENABLED)) {
      this.set(STORAGE_KEYS.VIBRATION_ENABLED, true);
    }
    if (!this.has(STORAGE_KEYS.HIGH_SCORES)) {
      this.set(STORAGE_KEYS.HIGH_SCORES, {});
    }
    if (!this.has(STORAGE_KEYS.USER_STATS)) {
      this.set(STORAGE_KEYS.USER_STATS, {
        totalPlays: 0,
        totalTime: 0,
        gamesPlayed: {},
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString()
      });
    }
    
    // Update last visit
    this.updateLastVisit();
  },
  
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },
  
  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },
  
  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key);
  },
  
  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },
  
  /**
   * Clear all storage
   */
  clear() {
    localStorage.clear();
  },
  
  // ========================================
  // High Scores
  // ========================================
  
  /**
   * Get high scores for a game
   * @param {string} gameId - Game identifier
   * @returns {Array} High scores
   */
  getHighScores(gameId) {
    const scores = this.get(STORAGE_KEYS.HIGH_SCORES, {});
    return scores[gameId] || [];
  },
  
  /**
   * Add a high score
   * @param {string} gameId - Game identifier
   * @param {Object} score - Score object
   * @param {number} maxEntries - Max scores to keep
   * @returns {boolean} Is high score
   */
  addHighScore(gameId, score, maxEntries = 10) {
    const scores = this.get(STORAGE_KEYS.HIGH_SCORES, {});
    if (!scores[gameId]) scores[gameId] = [];
    
    scores[gameId].push({
      ...score,
      date: new Date().toISOString()
    });
    
    // Sort by score (descending)
    scores[gameId].sort((a, b) => b.score - a.score);
    
    // Keep only top scores
    scores[gameId] = scores[gameId].slice(0, maxEntries);
    
    this.set(STORAGE_KEYS.HIGH_SCORES, scores);
    
    // Check if this score made it to the list
    return scores[gameId].some(s => 
      s.date === score.date && s.score === score.score
    );
  },
  
  /**
   * Clear high scores for a game
   * @param {string} gameId - Game identifier
   */
  clearHighScores(gameId) {
    const scores = this.get(STORAGE_KEYS.HIGH_SCORES, {});
    delete scores[gameId];
    this.set(STORAGE_KEYS.HIGH_SCORES, scores);
  },
  
  // ========================================
  // Game Progress
  // ========================================
  
  /**
   * Save game progress
   * @param {string} gameId - Game identifier
   * @param {*} state - Game state
   */
  saveProgress(gameId, state) {
    const progress = this.get(STORAGE_KEYS.GAME_PROGRESS, {});
    progress[gameId] = {
      state,
      savedAt: new Date().toISOString()
    };
    this.set(STORAGE_KEYS.GAME_PROGRESS, progress);
  },
  
  /**
   * Load game progress
   * @param {string} gameId - Game identifier
   * @returns {Object|null} Saved progress
   */
  loadProgress(gameId) {
    const progress = this.get(STORAGE_KEYS.GAME_PROGRESS, {});
    return progress[gameId] || null;
  },
  
  /**
   * Clear game progress
   * @param {string} gameId - Game identifier
   */
  clearProgress(gameId) {
    const progress = this.get(STORAGE_KEYS.GAME_PROGRESS, {});
    delete progress[gameId];
    this.set(STORAGE_KEYS.GAME_PROGRESS, progress);
  },
  
  // ========================================
  // User Stats
  // ========================================
  
  /**
   * Update last visit timestamp
   */
  updateLastVisit() {
    const stats = this.get(STORAGE_KEYS.USER_STATS);
    if (stats) {
      stats.lastVisit = new Date().toISOString();
      this.set(STORAGE_KEYS.USER_STATS, stats);
    }
  },
  
  /**
   * Record game play
   * @param {string} gameId - Game identifier
   * @param {number} duration - Play duration in seconds
   */
  recordPlay(gameId, duration = 0) {
    const stats = this.get(STORAGE_KEYS.USER_STATS);
    if (!stats) return;
    
    stats.totalPlays++;
    stats.totalTime += duration;
    
    if (!stats.gamesPlayed[gameId]) {
      stats.gamesPlayed[gameId] = { plays: 0, time: 0 };
    }
    stats.gamesPlayed[gameId].plays++;
    stats.gamesPlayed[gameId].time += duration;
    
    this.set(STORAGE_KEYS.USER_STATS, stats);
  },
  
  /**
   * Get user stats
   * @returns {Object} User statistics
   */
  getStats() {
    return this.get(STORAGE_KEYS.USER_STATS, {});
  },
  
  // ========================================
  // Settings
  // ========================================
  
  /**
   * Get theme
   * @returns {string} Current theme
   */
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  },
  
  /**
   * Set theme
   * @param {string} theme - Theme name
   */
  setTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  
  /**
   * Check if sound is enabled
   * @returns {boolean}
   */
  isSoundEnabled() {
    return this.get(STORAGE_KEYS.SOUND_ENABLED, true);
  },
  
  /**
   * Toggle sound
   * @returns {boolean} New state
   */
  toggleSound() {
    const enabled = !this.isSoundEnabled();
    this.set(STORAGE_KEYS.SOUND_ENABLED, enabled);
    return enabled;
  },
  
  /**
   * Check if vibration is enabled
   * @returns {boolean}
   */
  isVibrationEnabled() {
    return this.get(STORAGE_KEYS.VIBRATION_ENABLED, true);
  },
  
  /**
   * Vibrate device (if supported)
   * @param {number} duration - Vibration duration in ms
   */
  vibrate(duration = 50) {
    if (this.isVibrationEnabled() && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  },
  
  // ========================================
  // Migration
  // ========================================
  
  /**
   * Migrate storage to new version
   * @param {string} fromVersion - Old version
   */
  migrate(fromVersion) {
    console.log(`Migrating storage from ${fromVersion} to ${CURRENT_VERSION}`);
    
    // Migration logic for future versions
    // if (fromVersion === '0.9.0') {
    //   // Migrate data
    // }
    
    this.set(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  StorageManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager, STORAGE_KEYS };
}
