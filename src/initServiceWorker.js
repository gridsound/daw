"use strict";

if ( navigator.serviceWorker &&
	document.cookie.indexOf( "cookieAccepted" ) > -1
) {
	navigator.serviceWorker.register( "serviceWorker.js" )
		.then( reg => {
			console.log( `Service worker ${
				reg.installing ? "installing" :
				reg.waiting ? "installed" :
				reg.active ? "active" : "" }` );
		}, console.log.bind( console, "Service worker registration failed" ) );
}
