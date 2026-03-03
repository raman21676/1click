# Chess Game Redesign Plan

## Overview
Transform the current Chess game into a 3-mode game with proper menu/game separation and online multiplayer, similar to Ludo.

---

## Phase 1: Separate Menu and Game Screens

### Current Problem
- Menu and board shown on same page
- Board too small on mobile
- Confusing UX

### Solution
Create two distinct screens:

1. **Setup Screen (`#setupScreen`)**
   - Game title and branding
   - Mode selection (Pass & Play, vs AI, Online)
   - Options based on selected mode:
     - Pass & Play: Player names, side selection
     - vs AI: Difficulty (Easy/Medium/Hard), side selection
     - Online: Create Room / Join Room options
   - "Start Game" button

2. **Game Screen (`#gameScreen`)**
   - Full-screen game board (responsive sizing)
   - Player panels (top/bottom or sides)
   - Control bar (Undo, Hint, Flip, Menu, Resign)
   - Turn indicator

### CSS Classes
```css
.setup-screen { position: fixed; inset: 0; display: flex; ... }
.setup-screen.hidden { display: none; }

.game-screen { display: none; height: 100dvh; flex-direction: column; ... }
.game-screen.active { display: flex; }
```

### Screen Switching Logic
```javascript
function showSetup() {
  document.getElementById('setupScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.remove('active');
}

function showGame() {
  document.getElementById('setupScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.add('active');
}
```

---

## Phase 2: Three Game Modes

### Mode 1: Pass & Play (Local Multiplayer)
- 2 players on same device
- Players enter names
- Select who plays White/Black
- Turn indicator shows current player name
- Board flip option disabled (or flips after each move)

### Mode 2: vs Computer (AI)
- Single player vs AI
- Difficulty levels: Easy, Medium, Hard
- Player selects side (White/Black)
- AI uses minimax with alpha-beta pruning
- Different depth based on difficulty:
  - Easy: depth 2 + random moves
  - Medium: depth 3
  - Hard: depth 4-5

### Mode 3: Online Multiplayer
- Play with friends remotely
- PeerJS WebRTC for P2P connection
- 6-digit room code system
- Host creates room, guests join
- Real-time move synchronization
- Disconnect handling

### Mode Selection UI
```html
<div class="mode-selection">
  <button class="mode-btn active" data-mode="ai">
    <span class="mode-icon">🤖</span>
    <span class="mode-title">vs Computer</span>
    <span class="mode-desc">Play against AI</span>
  </button>
  
  <button class="mode-btn" data-mode="local">
    <span class="mode-icon">👥</span>
    <span class="mode-title">Pass & Play</span>
    <span class="mode-desc">Play with friends on this device</span>
  </button>
  
  <button class="mode-btn" data-mode="online">
    <span class="mode-icon">🌐</span>
    <span class="mode-title">Online</span>
    <span class="mode-desc">Play with friends online</span>
  </button>
</div>
```

---

## Phase 3: Online Multiplayer (PeerJS)

### Architecture
- Use PeerJS library (CDN: `https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js`)
- P2P connection (WebRTC)
- Host creates room with 6-digit code
- Guest joins using the code
- No server required after connection

### Implementation Details

#### Host Flow
1. Click "Create Room"
2. Generate 6-digit random code (e.g., "123456")
3. Create Peer with code as ID: `peer = new Peer(roomCode, { ... })`
4. Wait for connections: `peer.on('connection', conn => { ... })`
5. Display room code prominently
6. Show "Start Game" when guest connects
7. Assign colors: Host = White, Guest = Black (or random)

#### Guest Flow
1. Click "Join Room"
2. Enter 6-digit code
3. Connect to host: `conn = peer.connect(roomCode)`
4. Wait for "Start Game" from host
5. Show "Waiting for host..." status

#### Data Synchronization
```javascript
// Send move to opponent
function sendMove(from, to, piece, capture) {
  sendToPeer({
    type: 'move',
    from: from,
    to: to,
    piece: piece,
    capture: capture,
    timestamp: Date.now()
  });
}

// Receive move from opponent
function onPeerData(data) {
  if (data.type === 'move') {
    executeMove(data.from, data.to, data.piece);
  } else if (data.type === 'turn') {
    setTurn(data.player);
  }
}
```

#### Connection States
- Display connection status (connecting, connected, disconnected)
- Auto-reconnect on disconnect
- Show opponent's online status

---

## Phase 4: Mobile Responsive Board

### Current Problem
- Board too small on mobile
- Hard to tap pieces

### Solution

#### Responsive Board Sizing
```css
#board {
  /* Use viewport minimum for square sizing */
  width: min(95vmin, 500px);
  height: min(95vmin, 500px);
}

/* Mobile landscape: smaller board to fit controls */
@media (max-height: 600px) {
  #board {
    width: min(70vmin, 350px);
    height: min(70vmin, 350px);
  }
}
```

#### Touch Optimization
- Minimum 44px touch targets
- Larger pieces on mobile
- Visual feedback on touch
- Prevent accidental moves (confirm on captures)

#### Layout Adjustments
```css
/* Portrait: Board centered, controls below */
@media (orientation: portrait) {
  .game-layout {
    flex-direction: column;
  }
  .board-area {
    flex: 1;
  }
  .controls {
    padding: 10px;
  }
}

/* Landscape: Board left, controls/info right */
@media (orientation: landscape) and (max-height: 600px) {
  .game-layout {
    flex-direction: row;
  }
  .side-panel {
    width: 200px;
  }
}
```

---

## Phase 5: Testing and Polish

### Test Cases
1. **Mode Switching**: Test all 3 modes work correctly
2. **Screen Transition**: Menu → Game → Menu works smoothly
3. **AI Difficulty**: Verify AI strength at each level
4. **Online Multiplayer**:
   - Create room success
   - Join room success
   - Move sync working
   - Disconnect handling
   - Reconnection
5. **Mobile Responsive**: Test on various screen sizes
6. **Game Rules**: All chess rules working (castling, en passant, promotion, check, checkmate)

### Polish Items
- Smooth animations (piece movement, transitions)
- Sound effects (optional toggle)
- Haptic feedback on mobile
- Loading states
- Error messages
- Connection status indicators

---

## File Structure
```
src/games/chess/
├── index.html          # Main game file
├── style.css           # (Optional) Extracted styles
└── README.md           # Game documentation
```

## Technical Stack
- HTML5/CSS3/JavaScript (ES6+)
- PeerJS for online multiplayer
- No external frameworks (vanilla JS)
- Responsive design with CSS Grid/Flexbox

## Deployment
- GitHub Pages for hosting
- HTTPS required for PeerJS
- CNAME for custom domain
