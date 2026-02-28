# 🏗️ 1click - Architecture & Blueprint

> Complete technical architecture for the 1click gaming platform

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   UI Layer  │  │  Game Logic │  │    State Management     │  │
│  │  (HTML/CSS) │  │  (JS/Canvas)│  │    (LocalStorage)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB PAGES (Static Hosting)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   index.html│  │  game files │  │    assets (css/js/img)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Git Push
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS (CI/CD)                        │
│              Auto-deploy on every push to main                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Directory Structure

```
1click/
│
├── 📄 index.html                 # Landing page - Game selection
├── 📄 404.html                   # Custom error page
├── 📄 CNAME                      # Custom domain config
│
├── 📁 src/
│   ├── 📁 games/                 # All game implementations
│   │   ├── 📁 tictactoe/         # Tic-Tac-Toe
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   └── style.css
│   │   ├── 📁 snake/             # Snake Game
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   └── style.css
│   │   ├── 📁 sudoku/            # Sudoku
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   ├── generator.js
│   │   │   └── style.css
│   │   ├── 📁 baagchal/          # Nepali Game
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   └── style.css
│   │   ├── 📁 truth-dare/        # Truth or Dare
│   │   │   ├── index.html
│   │   │   ├── spinner.js
│   │   │   └── style.css
│   │   ├── 📁 ludo/              # Ludo
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   └── style.css
│   │   ├── 📁 chess/             # Chess
│   │   │   ├── index.html
│   │   │   ├── game.js
│   │   │   ├── chess-engine.js
│   │   │   └── style.css
│   │   └── 📁 snake-ladder/      # Snake & Ladder
│   │       ├── index.html
│   │       ├── game.js
│   │       └── style.css
│   │
│   └── 📁 assets/
│       ├── 📁 css/
│       │   ├── main.css          # Global styles
│       │   ├── variables.css     # CSS variables (colors, etc)
│       │   └── responsive.css    # Media queries
│       ├── 📁 js/
│       │   ├── main.js           # Shared utilities
│       │   ├── storage.js        # LocalStorage wrapper
│       │   ├── sound.js          # Sound management
│       │   └── analytics.js      # Ad/Analytics placeholder
│       └── 📁 images/
│           ├── logo.png
│           ├── icons/
│           └── games/            # Game-specific images
│
├── 📁 docs/                      # Additional documentation
│   ├── game-design.md
│   └── monetization.md
│
├── 📁 tests/                     # Test files
│   └── test-runner.html
│
└── 📁 .github/
    └── 📁 workflows/
        └── deploy.yml            # CI/CD pipeline
```

---

## 🎮 Game Architecture Patterns

### Pattern 1: Simple Grid Games (Tic-Tac-Toe, Sudoku)

```
┌────────────────────────────────────┐
│           Game Container           │
│  ┌──────────────────────────────┐  │
│  │        Game Grid (3x3)       │  │
│  │  ┌────┬────┬────┐            │  │
│  │  │ 0,0│ 0,1│ 0,2│            │  │
│  │  ├────┼────┼────┤            │  │
│  │  │ 1,0│ 1,1│ 1,2│            │  │
│  │  ├────┼────┼────┤            │  │
│  │  │ 2,0│ 2,1│ 2,2│            │  │
│  │  └────┴────┴────┘            │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │      Score/Status Panel      │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**Data Structure:**
```javascript
const gameState = {
  board: [[null, null, null],
          [null, null, null],
          [null, null, null]],
  currentPlayer: 'X',
  winner: null,
  moves: 0
};
```

---

### Pattern 2: Canvas Games (Snake, Baagchal)

```
┌────────────────────────────────────┐
│         Game Container             │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │      HTML5 Canvas            │  │
│  │    (requestAnimationFrame)   │  │
│  │                              │  │
│  │    ┌────┐                    │  │
│  │    │🐍  │ → →               │  │
│  │    └────┘                    │  │
│  │         ● food               │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│  Score: 100    [Pause] [Restart]   │
└────────────────────────────────────┘
```

**Game Loop:**
```javascript
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lastTime = 0;
    this.gameState = 'playing'; // 'playing', 'paused', 'gameover'
  }
  
  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    if (this.gameState === 'playing') {
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }
  
  update(deltaTime) {
    // Game logic: movement, collision, scoring
  }
  
  render() {
    // Clear and redraw canvas
  }
}
```

---

### Pattern 3: Board Games (Ludo, Snake & Ladder)

```
┌────────────────────────────────────────────┐
│              Board Game Layout             │
│  ┌──────────────────────────────────────┐  │
│  │  🏁                                  │  │
│  │  1 ── 2 ── 3 ── 4 ── 5 ── 6 ── 7    │  │
│  │  │                              │    │  │
│  │  24     ┌──────────────┐      8    │  │
│  │  │      │              │      │    │  │
│  │  23     │   CENTER     │      9    │  │
│  │  │      │   🏆         │      │    │  │
│  │  22     └──────────────┘     10    │  │
│  │  │                              │    │  │
│  │  21 ─ 20 ─ 19 ─ 18 ─ 17 ─ 16 ─ 15   │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│  [🎲 Roll Dice]  Turn: Player 1 (🔴)        │
└────────────────────────────────────────────┘
```

---

## 📊 Game State Management

### Local Storage Schema

```javascript
// storage.js - Key-Value Structure

const STORAGE_KEYS = {
  // Global Settings
  THEME: '1click_theme',           // 'light' | 'dark'
  LANGUAGE: '1click_lang',         // 'en' | 'ne' (Nepali)
  SOUND_ENABLED: '1click_sound',   // boolean
  
  // Game-Specific Data
  HIGH_SCORES: '1click_scores',    // { gameName: [{name, score, date}] }
  GAME_PROGRESS: '1click_progress', // { gameName: savedState }
  
  // User Stats
  TOTAL_PLAYS: '1click_plays',     // number
  TOTAL_TIME: '1click_time',       // seconds
  ACHIEVEMENTS: '1click_achievements'
};

// Example High Scores Structure
const highScores = {
  snake: [
    { name: 'Player', score: 150, date: '2026-02-28' },
    { name: 'Player', score: 120, date: '2026-02-27' }
  ],
  sudoku: [
    { name: 'Player', time: 180, difficulty: 'hard', date: '2026-02-28' }
  ]
};
```

---

## 🎨 Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #6366f1;        /* Indigo 500 */
  --color-primary-dark: #4f46e5;   /* Indigo 600 */
  --color-primary-light: #818cf8;  /* Indigo 400 */
  
  /* Secondary Colors */
  --color-secondary: #10b981;      /* Emerald 500 */
  --color-accent: #f59e0b;         /* Amber 500 */
  --color-danger: #ef4444;         /* Red 500 */
  
  /* Background */
  --bg-dark: #0f172a;              /* Slate 900 */
  --bg-card: #1e293b;              /* Slate 800 */
  --bg-light: #f8fafc;             /* Slate 50 */
  
  /* Text */
  --text-primary: #f1f5f9;         /* Slate 100 */
  --text-secondary: #94a3b8;       /* Slate 400 */
  --text-dark: #0f172a;            /* Slate 900 */
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-card: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
}
```

### Typography

```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Poppins', sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
}
```

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

---

## 🎮 Game Specifications

### 1. Tic-Tac-Toe
| Feature | Spec |
|---------|------|
| Grid | 3x3 |
| Players | 2 (local) or vs AI |
| AI Algorithm | Minimax |
| Difficulty | Easy, Medium, Hard |
| Duration | 1-5 minutes |

### 2. Snake
| Feature | Spec |
|---------|------|
| Grid | 20x20 |
| Speed | Increases with score |
| Controls | Arrow keys / Touch swipe |
| Scoring | 10 pts per food |
| High Score | Persistent (LocalStorage) |

### 3. Sudoku
| Feature | Spec |
|---------|------|
| Grid | 9x9 |
| Difficulties | Easy, Medium, Hard, Expert |
| Generator | Algorithm-based |
| Timer | Yes |
| Hints | 3 per game |

### 4. Baagchal (बाघचाल)
| Feature | Spec |
|---------|------|
| Players | 2 (1 Tiger, 4 Goats) |
| Board | 5x5 grid with diagonals |
| Rules | Nepali traditional rules |
| AI | Optional single-player |

### 5. Truth or Dare
| Feature | Spec |
|---------|------|
| Players | 2-8 |
| Input | Player names |
| Spinner | Animated bottle |
| Database | Built-in questions |
| Categories | Truth, Dare, Random |

### 6. Ludo
| Feature | Spec |
|---------|------|
| Players | 2-4 |
| Board | Standard Ludo |
| Rules | Classic rules |
| AI | Yes (2-3 player modes) |

### 7. Chess
| Feature | Spec |
|---------|------|
| Engine | Chess.js + custom AI |
| Difficulty | Beginner to Expert |
| Notation | Algebraic |
| Undo | Yes |
| Timer | Optional |

### 8. Snake & Ladder
| Feature | Spec |
|---------|------|
| Players | 2-4 |
| Board | 10x10 (1-100) |
| Snakes | 8-10 |
| Ladders | 8-10 |
| Dice | Animated 3D or 2D |

---

## 🚀 Performance Guidelines

### Target Metrics
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Game FPS | 60fps |

### Optimization Strategies

1. **Images**
   - Use WebP format
   - Lazy loading for below-fold images
   - SVG for icons

2. **JavaScript**
   - Minimize DOM manipulation
   - Use requestAnimationFrame for games
   - Debounce event handlers

3. **CSS**
   - Use CSS transforms over position changes
   - will-change for animated elements
   - Hardware acceleration: `transform: translateZ(0)`

4. **Assets**
   - Preload critical resources
   - Async/defer for non-critical scripts

---

## 🔌 Integration Points

### Android App (Future)
```javascript
// Game logic will be extracted to reusable modules
// WebView will load the same game files
// Native bridge for ads, notifications

// Expected structure for reuse:
/src
  /shared
    /games
      - tictactoe-logic.js    // Pure JS, no DOM
      - snake-logic.js
      - sudoku-generator.js
```

### Monetization (Ads)
```html
<!-- Google AdSense or similar -->
<!-- Placeholder for ad containers -->
<div id="ad-banner-top" class="ad-container"></div>
<div id="ad-sidebar" class="ad-container"></div>
<div id="ad-game-interstitial" class="ad-container"></div>
```

---

## 📋 API Design (Internal)

### Game Interface
```javascript
class BaseGame {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.state = {};
    this.isPlaying = false;
  }
  
  init() { /* Setup game */ }
  start() { /* Start game */ }
  pause() { /* Pause game */ }
  resume() { /* Resume game */ }
  reset() { /* Reset to initial state */ }
  save() { /* Save to LocalStorage */ }
  load() { /* Load from LocalStorage */ }
  destroy() { /* Cleanup */ }
  
  // Events
  on(event, callback) { /* Subscribe */ }
  emit(event, data) { /* Publish */ }
}
```

---

**Version:** 1.0  
**Last Updated:** 2026-02-28  
**Next Update:** When new game patterns are added
