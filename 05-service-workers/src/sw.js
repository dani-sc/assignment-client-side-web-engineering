var CACHE_NAME = 'assignment-05-jpeer-cache-v1';
// DO NOT CACHE sw.js!
var urlsToCache = [
  '/index.html',
  '/favicon.ico',
  '/assets/css/global.css',
  '/assets/fonts/fontawesome-webfont.eot',
  '/assets/img/balloons.svg',
  '/assets/img/ci.png',
  '/assets/img/code.svg',
  '/assets/img/github-logo.png',
  '/assets/img/logo.svg',
  '/assets/img/me_bw.png',
  '/assets/img/og_jpeer.jpg',
  '/assets/img/promo_5.png',
  '/assets/img/responsive-default.png',
  '/assets/img/projects/portalbee.jpg',
  '/assets/img/projects/prazna.jpg',
  '/assets/img/projects/railroad-medium.png',
  '/assets/img/projects/railroad.png',
  '/assets/img/projects/schwarzkoenig-medium.png',
  '/assets/img/projects/schwarzkoenig.png',
  '/assets/img/projects/somnia.jpg',
  '/assets/img/projects/volxpop.jpg',
  '/assets/img/slider/fish.jpg',
  '/assets/img/slider/hoverfly.jpg',
  '/assets/js/app.js',
  '/assets/js/main.js',
  '/assets/js/template.js',
  '/assets/js/vendor.js',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Cloning the request, as it's a stream and can only be
        // consumed once.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloning the request, as it's a stream and can only be
        // consumed once.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Remove old caches if existent
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['assignment-05-jpeer-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});