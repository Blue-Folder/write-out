// WRITE OUT service worker: keeps the whole app on the tablet so it opens without internet.
// Your notes are NOT stored here — they live in the browser's own storage (IndexedDB) on the device.
// When you change the app, bump VERSION so old copies get cleaned up.
const VERSION = 'writeout-v2';
const SHELL = ['./', 'index.html'];          // must succeed, otherwise the app can't open offline
const EXTRA = [                              // nice to have; one failure doesn't block the rest
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

// A response is only worth keeping if it really is our file:
// not a redirect (hotel / train wifi login pages redirect) and not an error page.
const good = res => res && res.ok && !res.redirected && res.type === 'basic';

async function store(cache, path) {
  const res = await fetch(path, { cache: 'reload' });
  if (!good(res)) throw new Error('bad ' + path);
  await cache.put(path, res);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(SHELL.map(p => store(cache, p)));
    await Promise.allSettled(EXTRA.map(p => store(cache, p)));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function appPage() {
  const cache = await caches.open(VERSION);
  return (await cache.match('index.html')) || (await cache.match('./')) ||
         (await caches.match('index.html')) || (await caches.match('./'));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // The app page: fresh from the network when online (max 3 s), otherwise the saved copy.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith((async () => {
      try {
        const res = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000))
        ]);
        if (good(res)) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('index.html', copy));
          return res;
        }
        // Wifi login page, error page or anything strange: open the saved app instead.
        return (await appPage()) || res;
      } catch (e) {
        return (await appPage()) || Response.error();
      }
    })());
    return;
  }

  // Everything else (fonts, icons): from the saved copy, refreshed in the background.
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req)
      .then(res => { if (good(res)) cache.put(req, res.clone()); return res; })
      .catch(() => cached || Response.error());
    return cached || fresh;
  })());
});
