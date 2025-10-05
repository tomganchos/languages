/* GH Pages + Vite: офлайн с первого визита */
const VERSION = 'v1.2.0';
const STATIC = `static-${VERSION}`;
const DYNAMIC = `dynamic-${VERSION}`;

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC);
        // Базовые файлы
        await cache.addAll(['./', './index.html', './offline.html', './icon.svg']);

        // Прекашируем ассеты, перечисленные в index.html (JS/CSS/иконку)
        try {
            const res = await fetch('./index.html', { cache: 'no-cache' });
            const html = await res.text();
            const urls = new Set();

            for (const m of html.matchAll(/href="([^"]+\.(?:css|svg))"/g)) {
                const u = m[1]; if (!u.startsWith('http')) urls.add(u);
            }
            for (const m of html.matchAll(/src="([^"]+\.(?:js))"/g)) {
                const u = m[1]; if (!u.startsWith('http')) urls.add(u);
            }

            if (urls.size) await cache.addAll([...urls]);
        } catch (e) {
            // молча — офлайн-фолбек все равно сработает
        }
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => (k.startsWith('static-') || k.startsWith('dynamic-')) && k !== STATIC && k !== DYNAMIC ? caches.delete(k) : null));
        await self.clients.claim();
    })());
});

// нормализуем ключ для уроков: убираем ?random
function normalizedForContent(req) {
    try {
        const url = new URL(req.url);
        if (url.pathname.includes('/lessons/') || url.pathname.includes('/grammar/')) {
            url.search = '';
            return new Request(url.toString(), req);
        }
    } catch {}
    return req;
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin !== location.origin) return;

    // Навигации: сразу отдаём кэшированный index.html (App Shell)
    if (req.mode === 'navigate') {
        event.respondWith((async () => {
            const cache = await caches.open(STATIC);
            const cached = await cache.match('./index.html');
            if (cached) return cached;
            try {
                const fresh = await fetch(req);
                cache.put('./index.html', fresh.clone());
                return fresh;
            } catch {
                return (await cache.match('./offline.html')) || new Response('offline', { status: 200 });
            }
        })());
        return;
    }

    // Уроки/грамматика: cache-first, игнорим search
    if (url.pathname.includes('/lessons/') || url.pathname.includes('/grammar/')) {
        event.respondWith((async () => {
            const nreq = normalizedForContent(req);
            const cache = await caches.open(DYNAMIC);
            const hit = await cache.match(nreq, { ignoreSearch: true });
            if (hit) return hit;
            try {
                const resp = await fetch(req);
                if (resp && resp.ok) cache.put(nreq, resp.clone());
                return resp;
            } catch {
                return new Response(JSON.stringify({ error: 'offline' }), { headers: { 'Content-Type': 'application/json' } });
            }
        })());
        return;
    }

    // JS/CSS/иконки: cache-first
    if (/\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)) {
        event.respondWith((async () => {
            const cache = await caches.open(STATIC);
            const hit = await cache.match(req);
            if (hit) return hit;
            try {
                const resp = await fetch(req);
                if (resp && resp.ok) cache.put(req, resp.clone());
                return resp;
            } catch {
                return Response.error();
            }
        })());
    }
});