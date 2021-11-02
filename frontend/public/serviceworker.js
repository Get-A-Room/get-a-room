const CACHE_NAME = 'static-cache';
const urlsToCache = ['/index.html', '/offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');

            return cache.addAll(urlsToCache);
        })
    );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    console.log(event.request.url);

    // We do not want to cache authenticated related resources because they are canceled anyway
    if (event.request.url.indexOf('/auth/') !== -1) {
        return false;
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return (
                response ||
                fetch(event.request).catch(() => caches.match('offline.html'))
            );
        })
    );
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            )
        )
    );
});
