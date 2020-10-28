importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
    { url: '/', revison: '1' },
    { url: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2', revison: '1' },
    { url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revison: '1' },
    { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revison: '1' },
    { url: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap', revison: '1' },
    { url: '/.vscode/settings.json', revison: '1' },
    { url: '/assets/draw.svg', revison: '1' },
    { url: '/assets/home.webp', revison: '1' },
    { url: '/assets/home1.webp', revison: '1' },
    { url: '/assets/home2.webp', revison: '1' },
    { url: '/assets/logo-Rey.webp', revison: '1' },
    { url: '/assets/lost.svg', revison: '1' },
    { url: '/assets/none.svg', revison: '1' },
    { url: '/assets/won.svg', revison: '1' },
    { url: '/css/materialize.min.css', revison: '1' },
    { url: '/css/responsive.css', revison: '1' },
    { url: '/css/style.css', revison: '1' },
    { url: '/js/api.js', revison: '1' },
    { url: '/js/db.js', revison: '1' },
    { url: '/js/idb.js', revison: '1' },
    { url: '/js/main.js', revison: '1' },
    { url: '/js/materialize.min.js', revison: '1' },
    { url: '/js/nav.js', revison: '1' },
    { url: '/pages/home.html', revison: '1' },
    { url: '/pages/my-favorite.html', revison: '1' },
    { url: '/pages/standings.html', revison: '1' },
    { url: '/pages/teams.html', revison: '1' },
    { url: '/icon192x192.png', revison: '1' },
    { url: '/icon512x512.png', revison: '1' },
    { url: '/index.html', revison: '1' },
    { url: '/manifest.json', revison: '1' },
    { url: '/nav.html', revison: '1' },
    { url: '/package-lock.json', revison: '1' },
    { url: '/push.js', revison: '1' },
    { url: '/team.html', revison: '1 '}
])

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
)

self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        badge: './assets/logo-Rey.webp',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});