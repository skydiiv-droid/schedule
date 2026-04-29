const CACHE_NAME = 'monjayaki-v1';
const ASSETS = [
  './group-duty.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선, 실패하면 캐시 (Firebase 데이터는 항상 최신으로)
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firebaseio.com')) return; // Firebase는 캐시 안 함
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
