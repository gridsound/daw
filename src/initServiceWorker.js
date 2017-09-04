"use strict";

navigator.serviceWorker.register( "serviceWorker.js", { scope: "/daw/" } )
	.then( function( reg ) {
		console.log( "Service worker " + (
			reg.installing ? "installing" :
			reg.waiting ? "installed" :
			reg.active ? "active" : "" ) );
	}, function( err ) {
		console.log( "Service worker registration failed", err );
	} );
