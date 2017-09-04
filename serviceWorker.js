"use strict";

self.addEventListener( "install", function( e ) {
	e.waitUntil( caches.open( "daw" ).then( function( cache ) {
		return cache.addAll( [
			"/daw/index-prod.html",
			"/daw/assets/oswald-regular.ttf",
			"/daw/assets/inconsolata-regular.ttf",
			"/daw/assets/fontawesome-solid-900.woff"
		] );
	} ) );
} );

self.addEventListener( "fetch", function( e ) {
	e.respondWith( caches.match( e.request ).then( function( res ) {
		return res || fetch( e.request );
	} ) );
} );
