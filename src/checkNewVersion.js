"use strict";

setTimeout( function() {
	fetch( "https://gridsound.github.io/daw/VERSION?" + Math.random() )
		.then( res => res.text() )
		.then( res => {
			dom.version.classList.add( res === env.version ? "ok" : "ko" );
		} );
}, 2000 );
