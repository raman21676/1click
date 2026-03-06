# 🤖 AI Agent Guidelines - 1click Project

> **CRITICAL**: Read this entire file before making ANY changes to the project.

---

## 📋 Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | 1click |
| **Type** | Browser-based Mini Games Platform |
| **Domain** | https://1click.live |
| **GitHub Repo** | https://github.com/Raman21676/1click |
| **Live URL** | https://raman21676.github.io/1click/ |
| **Hosting** | GitHub Pages (Free) |
| **Tech Stack** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Build Process** | None - Static files only |
| **Package Manager** | None - No dependencies |

### Project Mission

Create a fast, smooth, serverless gaming website with 9+ mini games that:
- Requires NO dedicated server (all client-side)
- Supports both Website and future Android app
- Generates income through advertisements (planned)
- Auto-deploys on every GitHub push

---

## 🗂️ Directory Structure

```
1click/
│
├── index.html                      # Landing page with game cards
├── CNAME                           # Custom domain config (1click.live)
├── sitemap.xml                     # SEO sitemap
├── robots.txt                      # SEO robots file
├── README.md                       # Human-readable project overview
├── AGENTS.md                       # This file - AI agent guidelines
├── ARCHITECTURE.md                 # System design & game logic patterns
├── TODO.md                         # Current tasks & status
├── PROGRESS.md                     # Development log with session history
├── ISSUES.md                       # Bug tracking
├── CURRENT_ISSUES.md               # Active issues summary
├── LUDO_DESIGN_SPECS.md            # Ludo game specifications
├── LUDO_IMPROVEMENTS.md            # Ludo improvement tracking
├── LUDO_BUG_SUMMARY.md             # Ludo bug documentation
├── CHESS_REDESIGN_PLAN.md          # Chess redesign documentation
│
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Primary CI/CD workflow
│       └── static.yml              # Alternative static deployment
│
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── loading.css         # Loading screen & sound toggle styles
│   │   │   ├── main.css            # Global styles (legacy)
│   │   │   └── variables.css       # CSS variables (legacy)
│   │   ├── js/
│   │   │   ├── main.js             # Shared utilities
│   │   │   ├── storage.js          # LocalStorage wrapper
│   │   │   └── sound.js            # Sound manager (Web Audio API)
│   │   ├── images/                 # Game icons, logos
│   │   └── sounds/                 # Sound effect files (if any)
│   │
│   └── games/                      # Individual game implementations
│       ├── tictactoe/
│       │   └── index.html          # (~894 lines) Tic-Tac-Toe with AI
│       ├── snake/
│       │   └── index.html          # (~803 lines) Classic Snake game
│       ├── sudoku/
│       │   └── index.html          # (~1125 lines) Sudoku puzzle
│       ├── baagchal/
│       │   └── index.html          # (~2361 lines) Nepali Tiger vs Goats
│       │   └── assets/
│       │       └── ai-bot.png
│       ├── truth-or-dare/
│       │   └── index.html          # (~769 lines) Bottle spinner game
│       ├── ludo/
│       │   └── index.html          # (~3911 lines) Full Ludo with AI
│       │   └── assets/
│       │       ├── ai-bot.png
│       │       ├── cat.png
│       │       ├── eagle.png
│       │       ├── panda.png
│       │       └── tiger.png
│       ├── chess/
│       │   └── index.html          # (~2626 lines) Chess with AI
│       │   └── assets/
│       │       └── ai-bot.png
│       ├── snake-ladder/
│       │   └── index.html          # (~1746 lines) Snake & Ladder
│       │   └── assets/
│       │       └── AI-Bot.png
│       └── carrom/
│           └── index.html          # (~1191 lines) Carrom board game
│           └── assets/
│               ├── AI-Bot.png
│               ├── board.png
│               └── carromboard.png
│
├── tests/                          # Test directory (currently empty)
└── docs/                           # Additional documentation (currently empty)
```

---

## 💻 Technology Stack

### Core Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure & Canvas | Latest |
| CSS3 | Styling & Animations | Latest |
| JavaScript (ES6+) | Game Logic & Interactivity | ES2020+ |
| LocalStorage | Save Progress & Scores | Web API |
| Web Audio API | Sound Effects | Web API |

### Design System
- **Primary Colors**: Teal/Green gradient (`#14b8a6` to `#06b6d4`)
- **Dark Theme**: Slate-based (`#0f172a` background)
- **Light Theme**: Slate-50 based (`#f8fafc` background)
- **Fonts**: Inter (body), Poppins (display) - loaded from Google Fonts
- **CSS Variables**: Defined in each file's `:root` selector

### Key Patterns
1. **Self-contained games**: Each game is a single HTML file with embedded CSS and JavaScript
2. **Responsive design**: Mobile-first with `clamp()`, `vmin`, and media queries
3. **No external dependencies**: No npm, no build tools, no frameworks
4. **Shared utilities**: Common code in `src/assets/js/` and `src/assets/css/`

---

## 🎮 Games Architecture

### Game File Structure

Each game follows this pattern in a single HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags for SEO -->
    <meta charset="UTF-8">
    <meta name="description" content="...">
    <meta name="keywords" content="...">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">{...}</script>
    
    <style>
        /* Loading screen styles */
        /* Game-specific styles */
        /* Responsive media queries */
    </style>
</head>
<body>
    <!-- Loading screen -->
    <div id="loadingScreen">...</div>
    
    <!-- Sound toggle -->
    <button id="soundToggle">...</button>
    
    <!-- Game UI -->
    <div class="game-container">...</div>
    
    <script src="../../src/assets/js/sound.js"></script>
    <script>
        // Game initialization
        // Game logic
        // Event listeners
    </script>
</body>
</html>
```

### Game Categories

| Game Type | Games | Implementation |
|-----------|-------|----------------|
| Grid-based | Tic-Tac-Toe, Sudoku | CSS Grid, DOM manipulation |
| Canvas-based | Snake, Carrom | HTML5 Canvas, requestAnimationFrame |
| Board games | Ludo, Snake & Ladder, Chess, Baagchal | CSS Grid/SVG, complex state |
| Party games | Truth or Dare | CSS animations, random selection |

---

## 🔧 Development Guidelines

### Code Style

1. **JavaScript**
   - Use ES6+ features (arrow functions, const/let, template literals)
   - Prefer `const` over `let`, never use `var`
   - Use descriptive variable names
   - Comment complex game logic
   - Organize code: Constants → State → DOM refs → Functions → Init

2. **CSS**
   - Use CSS custom properties (variables) for colors
   - Mobile-first responsive design
   - Use `clamp()` for fluid typography and sizing
   - Avoid `!important` unless absolutely necessary
   - Group related styles together

3. **HTML**
   - Semantic HTML5 elements
   - Accessibility attributes (aria-label, role)
   - SEO meta tags on every page
   - Schema.org structured data for games

### Required Features for Each Game

Every game MUST include:

1. **Loading screen** (from `loading.css` pattern)
2. **Sound toggle button** (integrates with `sound.js`)
3. **Back button** linking to home page
4. **Responsive design** (mobile, tablet, desktop)
5. **SEO meta tags** (description, keywords, Open Graph)
6. **Schema.org structured data** (VideoGame type)
7. **Theme support** (dark/light mode classes)

### Local Storage Keys

```javascript
// Follow this naming convention:
'1click_theme'           // 'dark' | 'light'
'1click_soundEnabled'    // 'true' | 'false'
'1click_soundVolume'     // '0.0' to '1.0'
'1click_[game]_highscore' // Game-specific scores
'1click_[game]_progress'  // Saved game state
```

---

## 🚀 Build & Deployment

### No Build Process

This project has NO build step. Files are deployed as-is.

### Local Development

```bash
# Clone repository
git clone git@github.com:Raman21676/1click.git
cd 1click

# Open in browser (macOS)
open index.html

# Or serve with Python for testing
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment Process

1. **Automatic**: Push to `main` branch triggers GitHub Actions
2. **Workflow**: `.github/workflows/deploy.yml`
3. **Target**: GitHub Pages
4. **URL**: https://raman21676.github.io/1click/
5. **Custom Domain**: https://1click.live (via CNAME file)

### Git Workflow

```bash
# 1. Always pull latest before starting
git pull origin main

# 2. Make your changes
# ... edit files ...

# 3. Stage and commit
git add .
git commit -m "type: description

Details here
Related: TASK-001"

# 4. Push
git push origin main

# 5. Verify deployment (takes 1-2 minutes)
# Check: https://raman21676.github.io/1click/
```

### Commit Message Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - CSS/styling changes
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🧪 Testing

### Testing Strategy

Currently minimal automated testing. Testing is primarily manual:

1. **Browser Testing**
   - Safari (Primary) - macOS/iOS
   - Brave (Secondary) - Chrome-based
   - Test on both desktop and mobile

2. **Viewport Testing**
   - Desktop: 1920x1080, 1366x768
   - Tablet: 768x1024 (iPad)
   - Mobile: 375x667 (iPhone SE), 390x844 (iPhone 14)

3. **Manual Test Checklist**
   - [ ] Game loads without errors
   - [ ] All buttons interactive
   - [ ] Mobile touch controls work
   - [ ] Sound toggle functions
   - [ ] Theme toggle works (if implemented)
   - [ ] Back button returns to home
   - [ ] No console errors

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Game FPS | 60fps |

---

## 📊 Shared Utilities

### Sound Manager (`src/assets/js/sound.js`)

```javascript
// Initialize (called automatically on first click)
SoundManager.init();

// Play sounds
SoundManager.playClick();
SoundManager.playMove();
SoundManager.playWin();
SoundManager.playDiceRoll();
// ... see file for full list

// Toggle
SoundManager.toggle(); // Returns new state
```

### Storage Manager (`src/assets/js/storage.js`)

```javascript
// Get/Set items
StorageManager.get(key, defaultValue);
StorageManager.set(key, value);

// High scores
StorageManager.getHighScores(gameId);
StorageManager.addHighScore(gameId, score);

// Game progress
StorageManager.saveProgress(gameId, state);
StorageManager.loadProgress(gameId);

// Settings
StorageManager.getTheme();
StorageManager.setTheme('dark' | 'light');
StorageManager.isSoundEnabled();
StorageManager.toggleSound();
```

### Loading Screen (`src/assets/css/loading.css`)

```javascript
// Hide loading screen when game ready
setTimeout(() => {
  document.getElementById('loadingScreen').classList.add('hidden');
}, 500);
```

---

## 🔐 Security Considerations

1. **No Sensitive Data**: Never commit API keys, passwords, or credentials
2. **XSS Prevention**: Sanitize any user input before DOM insertion
3. **Content Security Policy**: Consider adding CSP headers (GitHub Pages limited)
4. **HTTPS**: Enforced by GitHub Pages and Cloudflare

---

## 📝 SEO Requirements

Every game page MUST include:

1. **Meta tags**: description, keywords, robots, theme-color
2. **Open Graph**: og:type, og:url, og:title, og:description
3. **Canonical URL**: `<link rel="canonical" href="...">`
4. **Schema.org**: VideoGame structured data
5. **Semantic HTML**: Proper heading hierarchy

---

## 🎯 Current Status (as of 2026-03-06)

### Games Completed ✅
1. Tic-Tac-Toe (with AI - Minimax)
2. Snake (3 difficulty levels)
3. Sudoku (4 board sizes, 4 difficulties)
4. Baagchal (4 Tigers vs 20 Goats, AI)
5. Ludo (2-4 players, AI, full rules)
6. Chess (vs AI, 3 difficulties)
7. Snake & Ladder (2-4 players)
8. Truth or Dare (bottle spinner)
9. Carrom (physics-based)

### Known Issues 🔴
See `CURRENT_ISSUES.md` for active bugs. Currently includes Ludo dice face rendering issues.

### Game-Specific Constants Reference

#### Carrom Board Coordinates (Calibrated 2026-03-06)

**Canvas Size:** 700 x 700 pixels

##### Four Boundary Walls (coins & striker cannot exceed)
| Boundary | Axis | Value | Description |
|----------|------|-------|-------------|
| **Left Wall** | X | **20** | Coins/striker bounce at x=20 |
| **Right Wall** | X | **680** | Coins/striker bounce at x=680 |
| **Top Wall** | Y | **20** | Coins/striker bounce at y=20 |
| **Bottom Wall** | Y | **680** | Coins/striker bounce at y=680 |

```javascript
// Four boundary wall coordinates
const PLAY_MIN = 20   // Left & Top wall position
const PLAY_MAX = 680  // Right & Bottom wall position
```

##### Four Corner Pockets (pocket detection zones - different from walls)
| Pocket | X | Y |
|--------|---|---|
| Top-Left | 32 | 32 |
| Top-Right | 668 | 32 |
| Bottom-Left | 32 | 668 |
| Bottom-Right | 668 | 668 |

```javascript
const POCKETS = [
  {x:32, y:32},     // Top-left
  {x:668, y:32},    // Top-right
  {x:32, y:668},    // Bottom-left
  {x:668, y:668}    // Bottom-right
]
const POCKET_R = 28  // Pocket detection radius
```

##### Striker Baseline Positions
| Position | Y Value | Description |
|----------|---------|-------------|
| STRIKER_Y_TOP | **75** | Opponent's baseline (top) |
| STRIKER_Y_BOTTOM | **590** | Player's baseline (bottom) |

##### Striker Sliding Range (X-axis)
| Limit | X Value | Description |
|-------|---------|-------------|
| BASELINE_X_MIN | **110** | Left red circle limit |
| BASELINE_X_MAX | **586** | Right red circle limit |

**File:** `src/games/carrom/index.html` (lines 327-368)

### Next Priorities
1. Fix Ludo dice visual bug
2. Add sound effects to remaining games
3. Implement Service Worker for offline play
4. Add Google AdSense integration
5. Android app preparation (WebView wrapper)

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| GitHub Repo | https://github.com/Raman21676/1click |
| Live Website | https://raman21676.github.io/1click/ |
| Custom Domain | https://1click.live |
| GitHub Actions | https://github.com/Raman21676/1click/actions |
| GitHub Pages Settings | https://github.com/Raman21676/1click/settings/pages |

---

## ⚠️ CRITICAL REMINDERS

1. **NEVER** commit `node_modules` or build artifacts (none exist)
2. **ALWAYS** test in browser before committing
3. **ALWAYS** update PROGRESS.md after completing work
4. **NEVER** delete documentation files (AGENTS.md, ARCHITECTURE.md, etc.)
5. **ALWAYS** use the GitHub repo: git@github.com:Raman21676/1click.git
6. **VERIFY** deployment after every push at https://1click.live

---

## 🤝 Communication with User

If you need help that you cannot do:
1. Explain what you need clearly
2. Why it's needed
3. What you've tried
4. Ask for specific help

---

**Last Updated:** 2026-03-06
**Version:** 2.1
**Next Review:** When Phase 4 (Polish) begins
