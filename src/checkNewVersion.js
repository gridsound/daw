"use strict";

setTimeout( function() {
	fetch( "https://gridsound.github.io/daw/VERSION?" + Math.random() )
		.then( res => res.text() )
		.then( res => {
			var status = res === env.version ? "ok" : "ko";

			dom.version.classList.add( status );
			dom.version.title = status === "ok"
				? "GridSound is up to date :)"
				: "Clear your cache for the version " + res;
		} );
}, 2000 );
