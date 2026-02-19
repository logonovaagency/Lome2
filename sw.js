const CACHE_NAME = "lome2-offline-v1";

// Liste précise de TOUS les fichiers à garder en mémoire
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./manifest.json",
  // Le logo
  "logo512.jpg",
  // Polices et Icônes (Google Fonts & FontAwesome)
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  // La carte (Leaflet) - Scripts et Styles
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  // Images des marqueurs de la carte (pour éviter les erreurs d'affichage)
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
];

// 1. INSTALLATION : On télécharge tout une seule fois
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installation et mise en cache...");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATION : On nettoie les anciens caches si on change de version
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Suppression de l'ancien cache :", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. INTERCEPTION (FETCH) : Stratégie "Cache d'abord, Internet ensuite"
// Si le fichier est dans le téléphone, on le prend direct (rapide + hors ligne).
// Sinon, on essaie de le télécharger.
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si trouvé dans le cache, on le retourne
      if (response) {
        return response;
      }
      // Sinon, on va le chercher sur internet
      return fetch(e.request).catch(() => {
        // Si pas d'internet et pas dans le cache, on ne peut rien faire pour ce fichier spécifique
        // (Optionnel : on pourrait renvoyer une page "Pas de connexion")
      });
    })
  );
});
