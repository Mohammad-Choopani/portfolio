// sw.js
// bump this on each deploy to force clients to refresh
const CACHE_VERSION = 'v1.0.0';
const RUNTIME = `runtime-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only GET + same-origin
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // HTML → network-first (updates show quickly)
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(req);
        return cached || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' }});
      }
    })());
    return;
  }

  // Static assets → stale-while-revalidate
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => {
      cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || network || fetch(req);
  })());
});
