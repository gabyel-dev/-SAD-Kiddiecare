const CACHE_NAME = "kiddiecare-cache-v1";

// Cache only the essential app files, not Vite dev server files
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  // Don't cache Vite-specific files in development
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  // For navigation requests, serve from cache if possible
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request);
        })
        .catch(() => {
          // Return basic offline page if everything fails
          return new Response(
            `
            <html>
              <body>
                <h1>KiddieCare</h1>
                <p>You're offline. Please check your internet connection.</p>
                <button onclick="window.location.reload()">Retry</button>
              </body>
            </html>
          `,
            {
              headers: { "Content-Type": "text/html" },
            }
          );
        })
    );
    return;
  }

  // For all other requests, try network first
  event.respondWith(fetch(event.request));
});
