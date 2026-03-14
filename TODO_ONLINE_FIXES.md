# Online Multiplayer Mode - Critical Fixes

## Issues Identified

### 1. ❌ No House Selection in Online Mode
**Problem:** Host creates room but cannot choose their house. Guest joins but cannot choose house either.
**Screenshot Evidence:** Room shows "Opponent connected!" but no house selection UI visible.

### 2. ❌ No Dice in Online Mode  
**Problem:** Game starts but corner dice are not visible (unlike Pass & Play mode).
**Screenshot Evidence:** Board visible with "You" and "AI 3" but no dice at corners.

### 3. ❌ No Player Name Input
**Problem:** No option to enter player name before creating/joining room.

### 4. ✅ Connection Working
**Working:** "Opponent connected!" message shows connection IS functional.

---

## Fix Plan

### Task 1: Add House Selection UI for Online Mode
**File:** `src/games/ludo/index.html`
**Location:** After opponent connects, before "Start Game"

**Changes Needed:**
- [ ] Add house selection section in "Create Room" UI (after connection)
- [ ] Add house selection section in "Join Room" UI (after connection)
- [ ] Show available houses (not taken by other player)
- [ ] Sync house selection between host and guest via PeerJS

### Task 2: Enable Corner Dice in Online Mode
**File:** `src/games/ludo/index.html`
**Location:** CSS and game initialization

**Changes Needed:**
- [ ] Fix CSS: `.game-wrapper.local-mode .corner-dice` should also apply to online mode
- [ ] OR add new class `.game-wrapper.online-mode .corner-dice`
- [ ] Ensure dice positioning works for online mode (currently only for local-mode)

### Task 3: Add Player Name Input
**File:** `src/games/ludo/index.html`
**Location:** Create Room and Join Room sections

**Changes Needed:**
- [ ] Add name input field in "Create Room" screen
- [ ] Add name input field in "Join Room" screen  
- [ ] Send player name in PeerJS connection data
- [ ] Display connected player names in room UI

### Task 4: Update Game Flow
**File:** `src/games/ludo/index.html`

**Changes Needed:**
- [ ] Block "Start Game" until both players select houses
- [ ] Show selected houses in UI before starting
- [ ] Pass house selection to `startGame()` function

---

## Implementation Priority

1. **Task 2 (Dice)** - Critical, blocks gameplay
2. **Task 1 (House Selection)** - Critical, blocks proper game setup  
3. **Task 3 (Name Input)** - Medium, quality of life improvement
4. **Task 4 (Flow)** - Medium, polish

---

## Testing Checklist

- [ ] Create room → See house selection → Choose house → Guest chooses house → Start game → Dice visible
- [ ] Join room → See house selection → Choose remaining house → Start game → Dice visible
- [ ] Names show correctly for both players
- [ ] Gameplay works with chosen houses
