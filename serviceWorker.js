"use strict";

self.addEventListener( "install", e => {
	e.waitUntil( caches.open( "daw" ).then( cache => (
		cache.addAll( [
			"/daw/",
			"/daw/index.html",
			"/assets/fa-solid-900.woff",
			"/assets/fa-brands-400.woff",
		] )
	) ) );
} );

self.addEventListener( "fetch", e => {
	e.respondWith(
		fetch( e.request ).catch( () => caches.match( e.request ) )
	);
} );

/*
self.addEventListener( "fetch", e => {
	e.respondWith(
		caches.match( e.request ).then( response => response || fetch( e.request ) )
	);
} );
*/
