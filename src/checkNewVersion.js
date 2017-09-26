"use strict";

setTimeout( function() {
	fetch( "https://gridsound.github.io/daw/VERSION" )
		.then( res => res.text() )
		.then( res => {
			if ( res !== env.version ) {
				if ( confirm( `GridSound v${ res } is ready.\nDo you want to refresh your tab?` ) ) {
					location.reload( true );
				}
			}
		} );
}, 2000 );
