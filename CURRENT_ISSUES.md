# Ludo Game - Current Issues Summary

## Issue 1: Dice Shows Wrong Faces (NEW BUG)
**Status:** Broken by recent changes

The 3D cube dice is showing wrong dot patterns:
- Face 6 shows 1 dot instead of 6 dots
- Likely caused by incorrect CSS grid layouts for `.face-6 .dots`

**File:** `src/games/ludo/index.html`  
**Lines:** CSS around line 180-240

**Current broken CSS:**
```css
.face-6 .dots{ display: grid; grid-template-columns: 1fr 1fr; 
               grid-template-rows: 1fr 1fr 1fr; padding: 15%; gap: 10%; }
```

This doesn't properly position 6 dots in a 2x3 grid.

**Fix needed:** Rewrite dice face CSS with proper dot positioning:
```css
.face-6 .dots {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  width: 100%;
  height: 100%;
  padding: 20%;
  gap: 15%;
}
.face-6 .dots .dot:nth-child(1) { grid-area: 1 / 1; }
.face-6 .dots .dot:nth-child(2) { grid-area: 1 / 2; }
.face-6 .dots .dot:nth-child(3) { grid-area: 2 / 1; }
.face-6 .dots .dot:nth-child(4) { grid-area: 2 / 2; }
.face-6 .dots .dot:nth-child(5) { grid-area: 3 / 1; }
.face-6 .dots .dot:nth-child(6) { grid-area: 3 / 2; }
```

---

## Issue 2: Tokens Spawn at Wrong Entry Points (ORIGINAL BUG)
**Status:** Still not fixed

When player rolls 6 and moves token from home:
- Green token appears at Yellow's entry
- Likely row/column swapped somewhere

**File:** `src/games/ludo/index.html`

**Key code:**
```javascript
// Line 509-526: PATH array
const PATH = [[6,1],[6,2],...]; // [row, col] format

// Line 543: Reverse lookup  
const RC_TO_GLOBAL = {};
PATH.forEach(([r,c],i) => { RC_TO_GLOBAL[`${r}-${c}`] = i; });

// Line 608-610: cellInfo uses lookup
const gpos = RC_TO_GLOBAL[`${r}-${c}`];

// Line 749-750: getCellForPos calculates position
const globalIdx = (ENTRY[player] + local - 1) % 52;
const cell = document.querySelector(`[data-gpos="${globalIdx}"]`);
```

**Claude AI's diagnosis:** Row/column may be swapped somewhere in board building.

**To debug:** Add this to browser console after page loads:
```javascript
// Check if gpos 13 (Green's entry) is at correct cell
const cell13 = document.querySelector('[data-gpos="13"]');
console.log('gpos 13 cell ID:', cell13?.id); // Should be C1-8
console.log('gpos 13 classes:', cell13?.className); // Should have eG

// Check gpos 26 (Yellow's entry)
const cell26 = document.querySelector('[data-gpos="26"]');
console.log('gpos 26 cell ID:', cell26?.id); // Should be C8-13
```

---

## Issue 3: Dice 3D Rotation Working But Faces Wrong
**Status:** Mechanism works, faces are wrong

The 3D cube rotates properly but shows wrong dot patterns.
The `FACE_ROTATIONS` object is correct:
```javascript
const FACE_ROTATIONS = {
  1: {x: 0, y: 0, z: 0},      // Front
  2: {x: 0, y: 180, z: 0},    // Back  
  3: {x: 0, y: -90, z: 0},    // Right
  4: {x: 0, y: 90, z: 0},     // Left
  5: {x: -90, y: 0, z: 0},    // Top
  6: {x: 90, y: 0, z: 0}      // Bottom
};
```

Problem is the HTML/CSS for each face's dots.

---

## Recommended Action

1. **Revert dice to simple 2D version** that worked before
2. **Focus on fixing token entry bug** - it's the critical issue
3. **Add proper debug logging** to trace exactly where tokens go

The token bug is the most important - dice is cosmetic, token placement breaks the game.
