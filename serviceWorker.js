"use strict";

self.addEventListener( "install", e => {
	e.waitUntil( caches.open( "daw" ).then( cache => (
		cache.addAll( [
			"/daw/index.html",
			"/daw/assets/fa-solid-900.woff",
			"/daw/assets/fa-brands-400.woff",
		] )
	) ) );
} );

self.addEventListener( "fetch", e => {
	e.respondWith( fetch( e.request ).catch(
		() => caches.match( e.request ) ) );

	// Todo: add a system to check if the user has the most up to date vertsion.
	// e.respondWith( caches.match( e.request ).then( function( res ) {
	// 	return res || fetch( e.request );
	// } ) );
} );
