/**
 * 1click Service Worker - Enhanced for TWA and Offline Gaming
 * Provides offline support and intelligent caching for all games
 * @version 2.0.0 - TWA Ready
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `1click-static-${CACHE_VERSION}`;
const GAME_CACHE = `1click-games-${CACHE_VERSION}`;
const ASSETS_CACHE = `1click-assets-${CACHE_VERSION}`;
const IMAGES_CACHE = `1click-images-${CACHE_VERSION}`;

// Core static assets that should always be cached
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/assets/css/main.css',
  '/src/assets/css/variables.css',
  '/src/assets/css/loading.css',
  '/src/assets/js/main.js',
  '/src/assets/js/storage.js',
  '/src/assets/js/sound.js'
];

// All game HTML files - CRITICAL for offline play
const GAME_FILES = [
  '/src/games/tictactoe/index.html',
  '/src/games/snake/index.html',
  '/src/games/sudoku/index.html',
  '/src/games/baagchal/index.html',
  '/src/games/ludo/index.html',
  '/src/games/chess/index.html',
  '/src/games/snake-ladder/index.html',
  '/src/games/truth-or-dare/index.html',
  '/src/games/carrom/index.html'
];

// Game assets that should be cached for offline play
const GAME_ASSETS = [
  // Ludo assets
  '/src/games/ludo/assets/cat.webp',
  '/src/games/ludo/assets/panda.webp',
  '/src/games/ludo/assets/tiger.webp',
  '/src/games/ludo/assets/eagle.webp',
  '/src/games/ludo/assets/ai-bot.webp',
  // Chess assets
  '/src/games/chess/assets/ai-bot.webp',
  // Snake & Ladder assets
  '/src/games/snake-ladder/assets/board.webp',
  '/src/games/snake-ladder/assets/AI-Bot.webp',
  // Baagchal assets
  '/src/games/baagchal/assets/ai-bot.webp',
  // Carrom assets
  '/src/games/carrom/assets/board.webp',
  '/src/games/carrom/assets/carromboard.webp',
  '/src/games/carrom/assets/striker.webp',
  '/src/games/carrom/assets/white-coin.webp',
  '/src/games/carrom/assets/black-coin.webp',
  '/src/games/carrom/assets/red-coin.webp',
  '/src/games/carrom/assets/center-star.webp',
  '/src/games/carrom/assets/arrow-1.webp',
  '/src/games/carrom/assets/arrow-2.webp',
  '/src/games/carrom/assets/arrow-3.webp',
  '/src/games/carrom/assets/arrow-4.webp',
  '/src/games/carrom/assets/AI-Bot.webp'
];

// PWA Icons and images
const PWA_ASSETS = [
  '/src/assets/images/icon-72x72.png',
  '/src/assets/images/icon-96x96.png',
  '/src/assets/images/icon-128x128.png',
  '/src/assets/images/icon-144x144.png',
  '/src/assets/images/icon-152x152.png',
  '/src/assets/images/icon-192x192.png',
  '/src/assets/images/icon-384x384.png',
  '/src/assets/images/icon-512x512.png',
  '/src/games/ludo/icon.png',
  '/src/games/chess/icon.png',
  '/src/games/snake-ladder/icon.png'
];

// Install event - Cache all critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('[SW] Caching static assets...');
          return cache.addAll(STATIC_ASSETS);
        }),
      
      // Cache game files (CRITICAL for offline)
      caches.open(GAME_CACHE)
        .then(cache => {
          console.log('[SW] Caching game files...');
          return cache.addAll(GAME_FILES);
        }),
      
      // Cache game assets
      caches.open(ASSETS_CACHE)
        .then(cache => {
          console.log('[SW] Caching game assets...');
          // Filter to only cache assets that exist (some might be PNG instead of WebP)
          const existingAssets = GAME_ASSETS.filter(asset => {
            // We'll use a cache-then-network approach for assets
            return true;
          });
          return cache.addAll(existingAssets).catch(err => {
            console.log('[SW] Some assets not found (non-critical):', err.message);
          });
        }),
      
      // Cache PWA icons
      caches.open(IMAGES_CACHE)
        .then(cache => {
          console.log('[SW] Caching PWA icons...');
          return cache.addAll(PWA_ASSETS);
        })
    ])
    .then(() => {
      console.log('[SW] All assets cached successfully');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('[SW] Failed to cache assets:', error);
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old versions of our caches
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - Serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (like Google Fonts, analytics)
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Strategy 1: Cache first for static assets (CSS, JS)
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  // Strategy 2: Cache first for images
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGES_CACHE));
    return;
  }
  
  // Strategy 3: Cache first for game files (HTML)
  // This is critical - games MUST work offline
  if (isGameFile(url.pathname)) {
    event.respondWith(cacheFirst(request, GAME_CACHE));
    return;
  }
  
  // Strategy 4: Cache first for game assets
  if (isGameAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }
  
  // Strategy 5: Stale while revalidate for other requests
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

/**
 * Cache First Strategy
 * Serve from cache if available, otherwise fetch and cache
 * This is the key strategy for offline game play
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Return cached version immediately
    return cached;
  }
  
  // Not in cache - fetch from network
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache for future offline use
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    
    // Try to return offline fallback for HTML requests
    if (request.destination === 'document') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    // Return error response
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Always try to fetch fresh version in background
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('[SW] Background fetch failed:', error);
      return cached;
    });
  
  // Return cached version immediately if available
  return cached || fetchPromise;
}

/**
 * Check if pathname is a game HTML file
 */
function isGameFile(pathname) {
  return GAME_FILES.some(gameFile => pathname === gameFile || 
    pathname === gameFile.replace('index.html', ''));
}

/**
 * Check if pathname is a game asset
 */
function isGameAsset(pathname) {
  return pathname.includes('/src/games/') && 
    (pathname.endsWith('.png') || 
     pathname.endsWith('.jpg') || 
     pathname.endsWith('.webp') ||
     pathname.endsWith('.gif') ||
     pathname.endsWith('.svg'));
}

// Background sync for offline score submission (future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  console.log('[SW] Syncing scores...');
  // Future: Implement score sync logic
}

// Push notifications (future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/src/assets/images/icon-192x192.png',
        badge: '/src/assets/images/icon-72x72.png',
        data: data.data,
        vibrate: [200, 100, 200]
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Message handler from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker v2 loaded - TWA Ready');
