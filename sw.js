// sw.js — always-fresh (no version bumps needed)
// Purpose: fetch everything straight from the network so new deploys show up
// immediately. If you're offline, HTML requests fall back to a small message.

self.addEventListener('install', (event) => {
  // Activate this SW immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Take control of all open clients
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const accept = event.request.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');

  if (isHTML) {
    // Network-first for HTML so updates appear right away
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() =>
          new Response(
            '<!doctype html><meta charset="utf-8"><h1>Offline</h1><p>This page is not available offline.</p>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          )
        )
    );
    return;
  }

  // For non-HTML assets, also go straight to the network (no cache)
  event.respondWith(fetch(event.request, { cache: 'no-store' }));
});
