// WRITE OUT service worker: keeps the whole app on the tablet so it opens without internet.
// Your notes are NOT stored here — they live in the browser's own storage (IndexedDB) on the device.
// When you change the app, bump VERSION so old copies get cleaned up.
const VERSION = 'writeout-v1';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/fonts.css',
  'fonts/big-shoulders-display-latin-800-normal.woff2',
  'fonts/big-shoulders-display-latin-ext-800-normal.woff2',
  'fonts/ibm-plex-mono-latin-400-normal.woff2',
  'fonts/ibm-plex-mono-latin-ext-400-normal.woff2',
  'fonts/ibm-plex-mono-latin-500-normal.woff2',
  'fonts/ibm-plex-mono-latin-ext-500-normal.woff2',
  'fonts/ibm-plex-sans-latin-400-normal.woff2',
  'fonts/ibm-plex-sans-latin-ext-400-normal.woff2',
  'fonts/ibm-plex-sans-latin-500-normal.woff2',
  'fonts/ibm-plex-sans-latin-ext-500-normal.woff2',
  'fonts/ibm-plex-sans-latin-600-normal.woff2',
  'fonts/ibm-plex-sans-latin-ext-600-normal.woff2',
  'fonts/literata-latin-opsz-normal.woff2',
  'fonts/literata-latin-ext-opsz-normal.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // The app page: fresh from the network when online (max 3 s), otherwise the saved copy.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      try {
        const res = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000))
        ]);
        if (res && res.ok) cache.put('index.html', res.clone());
        return res;
      } catch (e) {
        return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Everything else (fonts, icons): from the saved copy, refreshed in the background.
  event.respondWith(
    caches.open(VERSION).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
      return cached || fresh;
    })
  );
});
