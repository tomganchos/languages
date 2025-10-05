/* Simple runtime-caching Service Worker for Languages app */
const VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;

self.addEventListener('install', (event) => {
  // Keep SW immediately active
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([
      './',
      './index.html',
      './offline.html',
      './icon.svg',
      // Vite will produce hashed assets; we cache them on first visit via runtime logic below.
    ])).catch(()=>{})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (!key.endsWith(VERSION)) return caches.delete(key);
    }));
    await self.clients.claim();
  })());
});

// Helper: normalize cache key (strip ?random)
function normalizedRequest(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname.includes('/lessons/') || pathname.includes('/grammar/')) {
      url.search = ''; // strip search params so random busting doesn't break cache
      return new Request(url.toString(), { method: request.method, headers: request.headers, mode: request.mode, credentials: request.credentials, redirect: request.redirect, referrer: request.referrer, referrerPolicy: request.referrerPolicy, integrity: request.integrity, cache: request.cache, keepalive: request.keepalive });
    }
  } catch {}
  return request;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // 1) App navigation: Network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(STATIC_CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(STATIC_CACHE);
        return (await cache.match('./index.html')) || (await cache.match('./offline.html'));
      }
    })());
    return;
  }

  // 2) Lessons & grammar JSON: Cache-first (long-lived)
  if (url.pathname.includes('/lessons/') || url.pathname.includes('/grammar/')) {
    event.respondWith((async () => {
      const nreq = normalizedRequest(req);
      const cache = await caches.open(DYNAMIC_CACHE);
      const cached = await cache.match(nreq, { ignoreSearch: true });
      if (cached) return cached;
      const resp = await fetch(req).catch(()=>null);
      if (resp && resp.ok) cache.put(nreq, resp.clone());
      return resp || new Response(JSON.stringify({ error: 'offline' }), { headers: { 'Content-Type': 'application/json' }, status: 200 });
    })());
    return;
  }

  // 3) Static assets (JS/CSS/Images): Stale-While-Revalidate
  if (/\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((resp) => {
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      }).catch(()=>null);
      return cached || fetchPromise || Response.error();
    })());
  }
});
