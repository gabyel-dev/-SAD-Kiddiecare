const CACHE_NAME = "kiddiecare-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  // Remove Vite-specific files from cache - they shouldn't be cached in dev
];

self.addEventListener("install", (e) => {
  console.log("Service Worker installing");
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting()) // Activate immediately
      .catch(console.error)
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker activating");
  e.waitUntil(
    caches
      .keys()
      .then((keyList) =>
        Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Removing old cache:", key);
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim()) // Take control immediately
  );
});

self.addEventListener("fetch", (event) => {
  // Don't cache Vite dev server requests
  if (
    event.request.url.includes("localhost:5173") &&
    (event.request.url.includes("/@") || event.request.url.includes("vite"))
  ) {
    return; // Let browser handle these
  }

  // Only cache GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise make network request
      return fetch(event.request)
        .then((response) => {
          // Cache successful responses (optional)
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache))
              .catch(console.error);
          }
          return response;
        })
        .catch((error) => {
          console.log("Network failed, no cache available:", error);
          // You could return a generic offline page here if needed
          throw error;
        });
    })
  );
});
