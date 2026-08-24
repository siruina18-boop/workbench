/* 瑞娜工作台 Service Worker - 离线缓存 */
const CACHE_NAME = 'ruina-workbench-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-1024.png',
  './icons/icon-152.png',
  './icons/icon-167.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    }).catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){
        if(key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(response){
        return response;
      }).catch(function(){
        return new Response('离线中，请联网后刷新', { headers: {'Content-Type':'text/plain'} });
      });
    })
  );
});
