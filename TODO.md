# ✅ TODO - 1click Project Task Tracker

> Current status of all tasks, phases, and milestones

---

## 📊 Quick Overview

| Phase | Status | Progress | Target Completion |
|-------|--------|----------|-------------------|
| Phase 1: Foundation | 🟢 Done | 100% | 2026-03-01 |
| Phase 2: Core Games | 🟢 Done | 100% | 2026-03-15 |
| Phase 3: Advanced Games | 🟢 Done | 100% | 2026-04-01 |
| Phase 4: Polish & Launch | 🟡 In Progress | 85% | 2026-04-15 |
| Phase 5: Android App | 🟡 In Progress | 80% | 2026-05-01 |

---

## 🎯 Current Sprint: Ludo Game UI Adjustments (March 13, 2026)

### Overview
Based on user feedback and reference image "after_clear.png", the following adjustments are needed to perfect the Ludo game UI.

### Reference Image Analysis
- Board: Perfectly square, well-positioned
- Dice: Four dice at corners with "Roll!" labels
- Player Names: On houses (e.g., "Player 1" on red house)
- Stars: Clearly visible on path cells (not just dots)

---

## Phase 4.1: Board Size Adjustment 🎯

**Status:** 🟡 In Progress
**Priority:** High

### Description
Increase board size to cover more of the left/right unused space while maintaining perfect square proportions.

### Requirements
- [ ] Board must remain perfectly square (1:1 ratio)
- [ ] Increase size to fill side gaps
- [ ] No stretching/zooming/cropping
- [ ] Maintain current center position

### Technical Details
```css
/* Current: 92vw x 92vw */
/* Target: ~96vw x 96vw (or max available space) */
```

### Files to Modify
- `src/games/ludo/index.html` - `.board-wrapper` CSS

---

## Phase 4.2: Four Dice Positioning 🎲

**Status:** 🟡 In Progress
**Priority:** High

### Description
Move the four corner dice closer to the board with appropriate gap.

### Requirements
- [ ] Dice should be nearer to board edges
- [ ] Maintain gap between dice and board
- [ ] Keep dice visible and clickable
- [ ] Match reference image positioning

### Current vs Target
```css
/* Current */
.red-dice { top: 10px; left: 10px; }

/* Target - closer to board */
.red-dice { top: 5px; left: 5px; } /* or similar adjustment */
```

### Files to Modify
- `src/games/ludo/index.html` - `.corner-dice` positioning CSS

---

## Phase 4.3: Player Names on Houses 🏠

**Status:** 🟡 In Progress
**Priority:** High

### Description
Move player names from bottom panel back to the house areas (as shown in reference image).

### Requirements
- [ ] Remove names from bottom panel
- [ ] Add names to house corners (e.g., "Player 1" on red house)
- [ ] Match reference image style
- [ ] Names should be clearly visible

### Reference
From "after_clear.png":
- Red house: "Player 1"
- Green house: "Player 2"
- Yellow house: "Player 3"
- Blue house: "Player 4"

### Files to Modify
- `src/games/ludo/index.html` - Player panel HTML/CSS
- JavaScript for dynamic name placement

---

## Phase 4.4: Path Stars Size ⭐

**Status:** 🟡 In Progress
**Priority:** Medium

### Description
Increase star size on path cells - currently too small (like dots).

### Requirements
- [ ] Stars should be clearly visible
- [ ] Must NOT exceed/overlap their grid cell
- [ ] Fit comfortably inside the cell
- [ ] Match "after_clear.png" star size

### Technical Details
```css
/* Current */
.safe::after { font-size: min(10px, 60%); }

/* Target - larger but contained */
.safe::after { font-size: min(14px, 80%); } /* or similar */
```

### Files to Modify
- `src/games/ludo/index.html` - `.safe::after` CSS

---

## Phase 4.5: Testing & Verification ✅

**Status:** 🟡 In Progress
**Priority:** High

### Test Checklist
- [ ] Board is square and larger
- [ ] Dice are positioned correctly at corners
- [ ] Player names appear on houses
- [ ] Stars are visible but not overflowing
- [ ] No UI elements overlap
- [ ] Game is playable
- [ ] APK works on device

### Screenshots Required
- [ ] Game board with adjustments
- [ ] Pass & Play setup screen
- [ ] 4-player game in progress

---

## 📝 Notes

### Next Immediate Tasks:
1. Complete Phase 4.1-4.4 adjustments
2. Test on device
3. Rebuild APK with cache-busting
4. Take final screenshots for verification

### Technical Debt:
- TWA caching issue - may need to clear Chrome cache or use different URL

### Reference Materials:
- `after_clear.png` - Reference for final UI state
- Commit `4ee1143` - Original four dice implementation

---

**Last Updated:** 2026-03-13 23:00 IST  
**Updated By:** AI Agent (Ludo UI Polish Phase)
