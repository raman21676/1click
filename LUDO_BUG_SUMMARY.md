# Ludo Game Bug Summary for Claude AI

## Critical Bug: Tokens Spawn at Wrong Entry Points

### Problem Description
When a player rolls a 6 and moves a token from home (pos=0) to the board (pos=1), 
the token appears at the WRONG entry point - specifically, it appears at another 
player's entry instead of their own.

Example:
- Green rolls 6, clicks token
- Token appears at Yellow's entry point [8,13] instead of Green's entry [1,8]

### Code Location
File: `src/games/ludo/index.html`

### Key Code Sections

#### 1. PATH Array (lines 503-515)
```javascript
const PATH = [
  // Global 0-4: Red arm going right
  [6,1],[6,2],[6,3],[6,4],[6,5],
  // Global 5-12: left side going up + top
  [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
  // Global 13-17: Green arm going down
  [1,8],[2,8],[3,8],[4,8],[5,8],
  // ... continues for 52 cells
];
```

#### 2. ENTRY Mapping (line 456)
```javascript
const ENTRY = {red:0, green:13, yellow:26, blue:39};
```

#### 3. Token Movement Logic (lines 734-765)
```javascript
function getCellForPos(player, pos) {
  // ...
  // Main path
  const local = pos; // 1-52
  const globalIdx = (ENTRY[player] + local - 1) % 52;
  const cell = document.querySelector(`[data-gpos="${globalIdx}"]`);
  return cell;
}
```

#### 4. Board Building (lines 526-590)
```javascript
function cellInfo(r, c) {
  // Home corners
  if (r<6&&c<6) return {type:'home',p:'green'};
  if (r<6&&c>8) return {type:'home',p:'yellow'};
  if (r>8&&c<6) return {type:'home',p:'red'};
  if (r>8&&c>8) return {type:'home',p:'blue'};
  // ...
}
```

### Expected vs Actual Behavior

| Player | Entry Index | Expected Cell | Actual Cell (Bug) |
|--------|-------------|---------------|-------------------|
| Red    | 0           | [6,1]         | ?                 |
| Green  | 13          | [1,8]         | [8,13] (Yellow!)  |
| Yellow | 26          | [8,13]        | ?                 |
| Blue   | 39          | [13,6]        | ?                 |

### Visual Board Layout (15x15 grid)
```
Rows 0-5:  Top area (Green home left, Yellow home right)
Rows 6-8:  Center cross
Rows 9-14: Bottom area (Red home left, Blue home right)

Entry Points:
- Red:    [6,1] - Bottom-left, going RIGHT  (→)
- Green:  [1,8] - Top-center, going DOWN     (↓)
- Yellow: [8,13] - Right-center, going LEFT  (←)
- Blue:   [13,6] - Bottom-center, going UP   (↑)
```

### What Has Been Tried
1. Added debug logging - shows globalIdx calculation seems correct
2. Added visual flash when token placed - shows wrong cell flashing
3. Added colored entry cell backgrounds - entries are colored correctly

### The Mystery
The calculation `globalIdx = (ENTRY[player] + pos - 1) % 52` should work:
- Green: (13 + 1 - 1) % 52 = 13 → PATH[13] = [1,8] ✓

But token appears at Yellow's entry instead. Possible causes:
1. `data-gpos` attribute not set correctly on cells
2. Multiple cells have same `data-gpos` value
3. CSS grid positioning misaligned with PATH coordinates
4. Event handler attaching to wrong token
5. Race condition in rendering

### Request for Claude AI
Please thoroughly analyze the token placement logic and identify why tokens 
appear at the wrong entry point. Check:
1. Is `data-gpos` being set correctly in `applyCell()`?
2. Are PATH coordinates correctly mapped to CSS grid cells?
3. Is the querySelector finding the right cell?
4. Could there be a CSS positioning issue?

Repository: https://github.com/Raman21676/1click
File: src/games/ludo/index.html
