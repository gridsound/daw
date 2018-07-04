"use strict";

self.addEventListener( "install", function( e ) {
	e.waitUntil( caches.open( "daw" ).then( function( cache ) {
		return cache.addAll( [
			"/daw/index.html",
			"/daw/assets/fa-solid-900.woff",
			"/daw/assets/fa-brands-400.woff",
			"/daw/assets/oswald-regular.ttf",
			"/daw/assets/inconsolata-regular.ttf",
		] );
	} ) );
} );

self.addEventListener( "fetch", function( e ) {
	e.respondWith( fetch( e.request ).catch( function() {
		return caches.match( e.request );
	} ) );

	// Todo: add a system to check if the user has the most up to date vertsion.
	// e.respondWith( caches.match( e.request ).then( function( res ) {
	// 	return res || fetch( e.request );
	// } ) );
} );
