/**
 * 1click Service Worker
 * Provides offline support and caching for games
 * @version 1.0.0
 */

const CACHE_NAME = '1click-v1';
const STATIC_CACHE = '1click-static-v1';
const GAME_CACHE = '1click-games-v1';
const IMAGE_CACHE = '1click-images-v1';

// Core assets that should always be cached
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/css/main.css',
  '/src/assets/css/variables.css',
  '/src/assets/css/loading.css',
  '/src/assets/js/main.js',
  '/src/assets/js/storage.js',
  '/src/assets/js/sound.js'
];

// Game pages to cache
const GAME_PAGES = [
  '/src/games/tictactoe/',
  '/src/games/snake/',
  '/src/games/sudoku/',
  '/src/games/baagchal/',
  '/src/games/ludo/',
  '/src/games/chess/',
  '/src/games/snake-ladder/',
  '/src/games/truth-or-dare/',
  '/src/games/carrom/'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old versions of our caches
            if (cacheName !== STATIC_CACHE && 
                cacheName !== GAME_CACHE && 
                cacheName !== IMAGE_CACHE) {
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
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }
  
  // Strategy 3: Network first for game pages (HTML documents)
  if (request.destination === 'document' && isGamePage(url.pathname)) {
    event.respondWith(networkFirst(request, GAME_CACHE));
    return;
  }
  
  // Strategy 4: Stale while revalidate for other requests
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

/**
 * Cache First Strategy
 * Serve from cache if available, otherwise fetch and cache
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    // Return offline fallback if available
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First Strategy
 * Try network first, fall back to cache if offline
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...');
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page
    return caches.match('/offline.html');
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Always try to fetch fresh version
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
      return cached;
    });
  
  // Return cached version immediately if available
  return cached || fetchPromise;
}

/**
 * Check if pathname is a game page
 */
function isGamePage(pathname) {
  return GAME_PAGES.some((gamePath) => pathname.startsWith(gamePath));
}

// Background sync for offline form submissions (future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  // Future: Sync high scores when back online
  console.log('[SW] Syncing scores...');
}

// Push notifications (future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/src/assets/images/icon-192x192.png',
        badge: '/src/assets/images/badge-72x72.png',
        data: data.data
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

console.log('[SW] Service Worker loaded');
