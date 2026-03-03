/**
 * 1click - Enhanced Sound Manager
 * Provides sound effects for all games using Web Audio API
 */

const SoundManager = {
  enabled: true,
  volume: 0.5,
  audioContext: null,
  
  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  },
  
  /**
   * Play a tone with given parameters
   */
  playTone(frequency, duration, type = 'sine', volume = null) {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.value = frequency;
      osc.type = type;
      
      const vol = volume !== null ? volume : this.volume;
      gain.gain.setValueAtTime(vol, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Sound play failed:', e);
    }
  },
  
  /**
   * Play a sequence of notes
   */
  playSequence(notes, tempo = 150) {
    if (!this.enabled || !this.audioContext) return;
    
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.dur, note.type || 'sine', note.vol);
      }, i * tempo);
    });
  },
  
  // ========================================
  // UI Sounds
  // ========================================
  
  playClick() {
    this.playTone(800, 0.08, 'sine', 0.3);
  },
  
  playHover() {
    this.playTone(400, 0.05, 'sine', 0.1);
  },
  
  playSwitch() {
    this.playTone(600, 0.1, 'sine', 0.2);
  },
  
  // ========================================
  // Game Action Sounds
  // ========================================
  
  playMove() {
    // Soft click for piece movement
    this.playTone(523, 0.1, 'sine', 0.2);
  },
  
  playCapture() {
    // Capture sound - descending
    this.playSequence([
      { freq: 440, dur: 0.1, vol: 0.3 },
      { freq: 330, dur: 0.15, vol: 0.3 }
    ], 80);
  },
  
  playPlace() {
    // Placing a piece
    this.playTone(659, 0.12, 'sine', 0.25);
  },
  
  // ========================================
  // Success/Win Sounds
  // ========================================
  
  playSuccess() {
    // Victory fanfare - ascending major triad
    this.playSequence([
      { freq: 523.25, dur: 0.1, vol: 0.4 },  // C5
      { freq: 659.25, dur: 0.1, vol: 0.4 },  // E5
      { freq: 783.99, dur: 0.1, vol: 0.4 },  // G5
      { freq: 1046.50, dur: 0.3, vol: 0.4 }  // C6
    ], 120);
  },
  
  playWin() {
    // Extended win sound
    this.playSequence([
      { freq: 392, dur: 0.15, vol: 0.4 },   // G4
      { freq: 523, dur: 0.15, vol: 0.4 },   // C5
      { freq: 659, dur: 0.15, vol: 0.4 },   // E5
      { freq: 783, dur: 0.15, vol: 0.4 },   // G5
      { freq: 1046, dur: 0.4, vol: 0.5 }    // C6
    ], 150);
  },
  
  playLevelUp() {
    // Level up sound
    this.playSequence([
      { freq: 440, dur: 0.1, vol: 0.3 },
      { freq: 554, dur: 0.1, vol: 0.3 },
      { freq: 659, dur: 0.1, vol: 0.3 },
      { freq: 880, dur: 0.3, vol: 0.4 }
    ], 100);
  },
  
  // ========================================
  // Error/Loss Sounds
  // ========================================
  
  playError() {
    // Error buzz
    this.playTone(150, 0.3, 'sawtooth', 0.3);
  },
  
  playLose() {
    // Sad descending sound
    this.playSequence([
      { freq: 349, dur: 0.2, vol: 0.3 },   // F4
      { freq: 329, dur: 0.2, vol: 0.3 },   // E4
      { freq: 311, dur: 0.2, vol: 0.3 },   // D#4
      { freq: 294, dur: 0.4, vol: 0.3 }    // D4
    ], 180);
  },
  
  playGameOver() {
    // Game over sound
    this.playSequence([
      { freq: 392, dur: 0.3, vol: 0.4 },
      { freq: 349, dur: 0.3, vol: 0.4 },
      { freq: 329, dur: 0.3, vol: 0.4 },
      { freq: 294, dur: 0.6, vol: 0.4 }
    ], 250);
  },
  
  // ========================================
  // Game-Specific Sounds
  // ========================================
  
  playDiceRoll() {
    // Dice shaking sound - rapid clicks
    if (!this.enabled || !this.audioContext) return;
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.playTone(200 + Math.random() * 200, 0.05, 'sine', 0.15);
      }, i * 50);
    }
  },
  
  playEat() {
    // Snake eating food
    this.playSequence([
      { freq: 600, dur: 0.08, vol: 0.3 },
      { freq: 800, dur: 0.12, vol: 0.3 }
    ], 50);
  },
  
  playJump() {
    // Jump sound
    this.playTone(400, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(600, 0.15, 'square', 0.2), 50);
  },
  
  playTick() {
    // Timer tick
    this.playTone(1000, 0.03, 'sine', 0.1);
  },
  
  playHint() {
    // Hint reveal
    this.playTone(880, 0.1, 'sine', 0.2);
  },
  
  playCheck() {
    // Chess check alert
    this.playSequence([
      { freq: 440, dur: 0.15, vol: 0.3 },
      { freq: 440, dur: 0.15, vol: 0.3 }
    ], 200);
  },
  
  playSpin() {
    // Spinner/bottle spin
    this.playTone(300, 0.1, 'sine', 0.15);
  },
  
  // ========================================
  // Settings
  // ========================================
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    if (this.enabled) this.init();
    return this.enabled;
  },
  
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('soundVolume', this.volume);
  },
  
  loadSettings() {
    const savedEnabled = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }
};

// Load settings on script load
SoundManager.loadSettings();

// Initialize on first user interaction
document.addEventListener('click', () => {
  SoundManager.init();
}, { once: true });
