// Remove the legacy offline cache and return all pages to normal HTTP caching.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    await self.clients.claim();

    const windowClients = await self.clients.matchAll({ type: "window" });
    await Promise.all(windowClients.map((client) => {
      const url = new URL(client.url);
      url.searchParams.set("site-cache-reset", Date.now().toString());
      return client.navigate(url.toString());
    }));

    await self.registration.unregister();
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
