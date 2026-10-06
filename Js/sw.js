const CACHE_NAME = "musicfly-v1";

const ARQUIVOS = [
    "./",
    "./usuario.html",
    "./main.html",
    "./admin.html",

    "./css/style.css",
    "./css/usuario.css",
    "./css/main.css",
    "./css/admin.css",

    "./js/firebase.js",
    "./js/auth.js",
    "./js/database.js",
    "./js/musicas.js",
    "./js/usuario.js",
    "./js/main.js",
    "./js/admin.js",

    "./manifest.json"
];

self.addEventListener("install", (evento) => {

    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ARQUIVOS);
            })
    );

    self.skipWaiting();
});


self.addEventListener("activate", (evento) => {

    evento.waitUntil(
        caches.keys()
            .then((chaves) => {

                return Promise.all(
                    chaves
                        .filter((chave) => chave !== CACHE_NAME)
                        .map((chave) => caches.delete(chave))
                );

            })
    );

    self.clients.claim();
});


self.addEventListener("fetch", (evento) => {

    evento.respondWith(
        fetch(evento.request)
            .catch(() => caches.match(evento.request))
    );

});