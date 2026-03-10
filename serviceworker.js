const APP_VERSION = "ND 0.0.1.1";
const cacheName = "simtiva-" + APP_VERSION.replace(/\s+/g, '-');

const assets = [
	"/",
	"/index.html",
	"/manual.html",
	"/main.js",
	"/features.js",
	"/pharmacology.js",
	"/index.js",
	"/chartjs-plugin-crosshair.min.js",
	"/styles.css",
	"/styles-extra.css",
	"/css/fontawesome.min.css",
	"/css/solid.min.css",
	"/webfonts/fa-solid-900.woff2",
	"/chart.min.js",
	"/beep.mp3",
	"/beep-2.mp3",
	"/apple-touch-icon-180x180.png",
	"/fonts/BrandonText-Bold.otf",
	"/fonts/SourceSans3-Regular.otf.woff2",
	"/fonts/SourceSans3-Bold.otf.woff2",
	"/fonts/SourceSans3-It.otf.woff2",
	"/fonts/SourceSans3-BoldIt.otf.woff2",
	"/lz-string.js",
	"/iconintubation.png",
	"/preview.gif",
	"/preview2.gif",
	"/pwa.webp",
	"/offermoney.webp",
	"/users.webp"
]

// Install: cache all assets and skip waiting immediately
self.addEventListener("install", event => {
	self.skipWaiting();
	console.log("[SW] Installing version: " + APP_VERSION);
	event.waitUntil(
		caches.open(cacheName).then(cache => cache.addAll(assets))
	);
});

// Activate: clear old caches, claim all clients immediately
self.addEventListener("activate", event => {
	console.log("[SW] Activating version: " + APP_VERSION);
	event.waitUntil(
		caches.keys().then(cacheNames =>
			Promise.all(
				cacheNames.map(name => {
					if (name !== cacheName) {
						console.log("[SW] Deleting old cache: " + name);
						return caches.delete(name);
					}
				})
			)
		).then(() => self.clients.claim())
	);
});

// Fetch: cache-first, fall back to network
self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request).then(response => response || fetch(event.request))
	);
});

// Message: respond to version queries from the page
self.addEventListener("message", event => {
	if (event.data && event.data.type === "GET_VERSION") {
		event.ports[0].postMessage({ version: APP_VERSION });
	}
});
