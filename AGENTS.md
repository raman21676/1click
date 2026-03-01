# 🤖 AI Agent Guidelines - 1click Project

> **CRITICAL**: Read this entire file before making ANY changes to the project.

---

## 📋 Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | 1click |
| **Type** | Browser-based Mini Games Platform |
| **Domain** | 1click.live |
| **GitHub Repo** | git@github.com:Raman21676/1click.git |
| **Live URL** | https://raman21676.github.io/1click/ |
| **Custom Domain** | https://1click.live |
| **Hosting** | GitHub Pages (Free) |
| **Tech Stack** | HTML5, CSS3, Vanilla JavaScript |

---

## 🎯 Project Mission

Create a **fast, smooth, serverless** gaming website with 8+ mini games that:
- Requires NO dedicated server (all client-side)
- Supports both Website and future Android app
- Generates part-time income through advertisements
- Auto-deploys on every GitHub push

---

## 📁 File Structure (MUST FOLLOW)

```
1click/
├── AGENTS.md              ← You are here (READ FIRST)
├── ARCHITECTURE.md        ← System design & game logic
├── TODO.md                ← Current tasks & status
├── PROGRESS.md            ← Completed work log with commits
├── ISSUES.md              ← Errors & solutions log
├── README.md              ← Project overview for humans
├── .github/
│   └── workflows/
│       └── deploy.yml     ← CI/CD configuration
├── docs/                  ← Additional documentation
├── src/
│   ├── index.html         ← Main landing page
│   ├── games/             ← Individual game folders
│   │   ├── chess/
│   │   ├── ludo/
│   │   ├── snake-ladder/
│   │   ├── sudoku/
│   │   ├── baagchal/
│   │   ├── tictactoe/
│   │   ├── snake/
│   │   └── truth-dare/
│   └── assets/
│       ├── css/           ← Stylesheets
│       ├── js/            ← Shared JavaScript
│       └── images/        ← Game assets
└── tests/                 ← Test files
```

---

## 🔧 Your Responsibilities as AI Agent

### BEFORE Starting Work:
1. ✅ Read AGENTS.md (this file)
2. ✅ Read ARCHITECTURE.md for system design
3. ✅ Read TODO.md for current priorities
4. ✅ Read PROGRESS.md to understand what's done
5. ✅ Read ISSUES.md to avoid known problems

### WHILE Working:
1. ✅ Update TODO.md - Mark tasks as "in_progress"
2. ✅ Test changes locally using browser (Safari/Brave)
3. ✅ Follow existing code style
4. ✅ Add comments for complex logic
5. ✅ Update PROGRESS.md with what you're working on

### AFTER Completing Work:
1. ✅ Update TODO.md - Mark tasks as "done"
2. ✅ Update PROGRESS.md with:
   - What was completed
   - Date/Time
   - Files modified
   - Any issues encountered
3. ✅ Commit with descriptive message:
   ```
   git add .
   git commit -m "feat: add snake game movement logic
   
   - Implemented snake body tracking
   - Added collision detection
   - Closes task: SNAKE-001"
   git push origin main
   ```
4. ✅ Verify deployment at https://raman21676.github.io/1click/
5. ✅ Take screenshot if visual changes
6. ✅ Update ISSUES.md if any bugs were fixed

---

## 🎮 Games to Build (Priority Order)

| # | Game | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1 | Tic-Tac-Toe | ⏳ Pending | HIGH | Simplest, start here |
| 2 | Snake | ⏳ Pending | HIGH | Classic, test performance |
| 3 | Sudoku | ⏳ Pending | HIGH | Logic-based, no server needed |
| 4 | Baagchal | ⏳ Pending | HIGH | Nepali game, USP |
| 5 | Truth or Dare | ⏳ Pending | MEDIUM | Bottle spinner UI |
| 6 | Ludo | ⏳ Pending | MEDIUM | Complex logic |
| 7 | Chess | ⏳ Pending | LOW | Most complex, use Chess.js |
| 8 | Snake & Ladder | ⏳ Pending | LOW | Board game |

---

## 💻 Technology Guidelines

### DO:
- ✅ Use **Vanilla JavaScript** (no frameworks needed for simple games)
- ✅ Use **HTML5 Canvas** for games requiring graphics
- ✅ Use **CSS Grid/Flexbox** for layouts
- ✅ Use **LocalStorage** for saving game state
- ✅ Use **Service Workers** for offline play (later phase)
- ✅ Optimize images before adding to repo

### DON'T:
- ❌ Use heavy frameworks (React, Vue, Angular) - unnecessary overhead
- ❌ Add backend/server code - must remain serverless
- ❌ Use external CDNs for critical resources (keep it self-contained)
- ❌ Add node_modules or build tools unless absolutely necessary
- ❌ Commit large files (>10MB)

---

## 🔄 Git Workflow

```bash
# 1. Always pull latest before starting
git pull origin main

# 2. Make your changes
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit with meaningful message
git commit -m "type: description

Details here
Related: TASK-001"

# 5. Push
git push origin main

# 6. Verify deployment (takes 1-2 minutes)
# Check: https://raman21676.github.io/1click/
```

### Commit Message Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - CSS/styling changes
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🐛 Issue Reporting Format

When encountering errors, log in ISSUES.md:

```markdown
## Issue #X: [Brief Title]

**Date:** YYYY-MM-DD HH:MM  
**Severity:** High/Medium/Low  
**Status:** Open/In Progress/Resolved

### Problem
Description of the issue

### Error Message
```
Paste error here
```

### Steps to Reproduce
1. Step one
2. Step two

### Solution Applied
How it was fixed

### Files Modified
- file1.js
- file2.css

### Commit
`abc1234: fix: resolve issue X`
```

---

## 📱 Future Android App Considerations

- Keep game logic in separate JavaScript modules
- Avoid browser-specific APIs in core game logic
- Document all game state structures
- This allows reuse in WebView-based Android app later

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

## 📝 Browser Testing

**Available Browsers on MacBook:**
- Safari (Primary)
- Brave (Secondary)

**Test on:**
- Desktop (1920x1080, 1366x768)
- Mobile viewport (375x667 - iPhone SE)
- Tablet viewport (768x1024 - iPad)

---

## ⚠️ CRITICAL REMINDERS

1. **NEVER** commit directly without reading TODO.md first
2. **ALWAYS** test in browser before committing
3. **ALWAYS** update PROGRESS.md after completing work
4. **NEVER** delete AGENTS.md, ARCHITECTURE.md, TODO.md, PROGRESS.md, ISSUES.md
5. **ALWAYS** use the GitHub repo: git@github.com:Raman21676/1click.git
6. **VERIFY** deployment after every push

---

## 🤝 Communication with User

If you need help that you cannot do:
1. Explain what you need clearly
2. Why it's needed
3. What you've tried
4. Ask for specific help

Example:
> "I need help setting up the DNS records for 1click.live. I've created the CNAME file, but I need you to add A records in your domain provider's dashboard."

---

**Last Updated:** 2026-02-28 12:17 IST  
**Version:** 1.0  
**Next Review:** When Phase 1 completes
