/* Numérologie — service worker. L'app est 100 % locale : tout l'app shell est
   caché, aucun appel réseau n'est nécessaire au fonctionnement. Seul le contrôle
   de mise à jour (api.github.com) doit passer par le réseau. */
const CACHE = 'numerologie-v1.1';
const SHELL = [
  'index.html', 'styles.css', 'app.js',
  'numerologie.js', 'interpretations.js', 'tarot.js',
  'update-check.js', 'autobackup.js',
  'manifest.webmanifest', 'img/icon-192.png', 'img/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('api.github.com')) return;   // vérif de MAJ : réseau
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
