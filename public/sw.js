// Service Worker for Caching and Performance
const CACHE_NAME = 'danielwait-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/myStyles.css',
  '/js/nav-component.js',
  '/js/footer-component.js',
  '/js/analytics.js',
  '/js/cookie-banner.js',
  '/js/accessibility.js',
  '/js/performance.js',
  '/assets/profile.png',
  '/assets/logo.png',
  '/wait-works.html',
  '/wait-list.html',
  '/resume.html',
  '/projects.html',
  '/contact.html',
  '/privacy-policy.html',
  '/terms-of-service.html'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
