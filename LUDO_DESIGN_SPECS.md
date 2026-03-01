# Ludo Game Design Specifications

> Documenting all design decisions, colors, positions, and alignments for future reference.

---

## 🏠 House Positions

| Position | House Color | Animal Mascot | Token Slot Corners |
|----------|-------------|---------------|-------------------|
| Top-Left | Red 🔴 | Cat | (0,0), (0,5), (5,0), (5,5) |
| Top-Right | Green 🟢 | Panda | (0,9), (0,14), (5,9), (5,14) |
| Bottom-Right | Yellow 🟡 | Tiger | (9,9), (9,14), (14,9), (14,14) |
| Bottom-Left | Blue 🔵 | Eagle | (9,0), (9,5), (14,0), (14,5) |

### White Panel (Inner Area)
- Each house has a 4×4 white panel in the center
- White panel spans: rows 1-4, cols 1-4 (relative to house)
- Animal mascot is placed in the center of this white panel

### Token Slots
- 4 token slots per house, positioned at the 4 corners
- Outside the white panel, on the colored area
- Slots are at cells: (0,0), (0,5), (5,0), (5,5) for each house

---

## 🎯 Center Colors

### Center Corners (Triangular)
| Position | Color | Points To |
|----------|-------|-----------|
| Top-Left | Yellow 🟡 | Yellow house |
| Top-Right | Blue 🔵 | Blue house |
| Bottom-Right | Red 🔴 | Red house |
| Bottom-Left | Green 🟢 | Green house |

### Center Strips
| Position | Color | Points To |
|----------|-------|-----------|
| Top | Red 🔴 | Red house |
| Right | Yellow 🟡 | Yellow house |
| Bottom | Blue 🔵 | Blue house |
| Left | Green 🟢 | Green house |

---

## ⭐ Star Colors

Stars are positioned at safe squares and colored to match the nearest house:

| Global Position | Color | Nearest House |
|-----------------|-------|---------------|
| 0, 8 | Red 🔴 | Red house |
| 13, 21 | Green 🟢 | Green house |
| 26, 34 | Yellow 🟡 | Yellow house |
| 39, 47 | Blue 🔵 | Blue house |

---

## 🐱 Animal Mascot Placement

### Positioning Technique
Animals are placed using the following CSS:

```css
.house-animal {
  position: absolute;
  width: 260%;
  height: 260%;
  object-fit: contain;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,.4));
  top: 50%;
  left: 50%;
  transform: translate(-36%, -36%);  /* Perfect center adjustment */
}
```

### Center Cell Calculation
- White panel is 4×4 cells
- Center is at row + 1.5, col + 1.5 (between cells)
- Animal is placed at top-left of center 2×2: `(house.row + 1, house.col + 1)`
- Transform adjustment `(-36%, -36%)` achieves perfect center

### Animal Files
- Red house: `assets/cat.png`
- Green house: `assets/panda.png`
- Yellow house: `assets/tiger.png`
- Blue house: `assets/eagle.png`

All images are:
- Background removed (transparent PNG)
- Scaled up 2.5× from original
- Centered using mathematical calculation

---

## 🎨 Color Variables

```css
--red: #E53935    /* Red house, stars at 0,8 */
--green: #43A047  /* Green house, stars at 13,21 */
--yellow: #FDD835 /* Yellow house, stars at 26,34 */
--blue: #1E88E5   /* Blue house, stars at 39,47 */
--gold: #FFD700   /* Dice, decorative elements */
```

---

## 📐 Path Entry Points

| Player | Entry Global Position | Entry Coordinates | Direction |
|--------|----------------------|-------------------|-----------|
| Red | 0 | [6,1] | Right → |
| Green | 13 | [1,8] | Down ↓ |
| Yellow | 26 | [8,13] | Left ← |
| Blue | 39 | [13,6] | Up ↑ |

---

## 🔧 Technical Notes

### Centering Formula
To center an element that spans multiple grid cells:
1. Place at top-left cell of target area
2. Set width/height to 260% (spans ~2.6 cells)
3. Use `transform: translate(-36%, -36%)` to shift toward bottom-right
4. Adjust percentage based on visual testing

### Grid System
- Board: 15×15 grid
- Each cell: `grid-template-columns: repeat(15, 1fr)`
- Houses: 6×6 cells each (4 houses = 12×12 area)
- Center: 3×3 cells
- Paths: 3 cells wide connecting houses

---

## ✅ Verified Alignments

- [x] Houses rotated to match path entries
- [x] Center colors rotated to match houses
- [x] Stars colored by nearest house
- [x] Animals centered in white panels
- [x] Token slots at corners of houses
- [x] Path numbers removed (clean look)

---

**Last Updated:** 2026-03-01  
**Commit:** ded4f93 - Final perfect center adjustment
