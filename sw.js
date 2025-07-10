const CACHE_NAME = 'calculator-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// インストールイベント
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチイベント (リクエストのインターセプトとキャッシュからの応答)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュにある場合はそれを使用
                if (response) {
                    return response;
                }
                // キャッシュにない場合はネットワークから取得
                return fetch(event.request).catch(() => {
                    // ネットワークが利用できない場合、フォールバック（ここでは特にフォールバックなし）
                    console.log('Fetch failed for:', event.request.url);
                    // オフラインページなどを返すことも可能
                });
            })
    );
});

// アクティベートイベント (古いキャッシュのクリーンアップ)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // 不要なキャッシュを削除
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
