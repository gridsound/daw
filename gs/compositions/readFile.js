"use strict";

gs.compositions.readFile = function( saveFile ) {
	return new Promise( function( resolve, reject ) {
		if ( !saveFile ) {
			resolve();
		} else {
			var reader = new FileReader();

			reader.onload = function( e ) {
				// TODO: check if there is a cmp loaded BUT NOT saved.
				var cmp = JSON.parse( e.target.result );

				gs.compositions.store( cmp );
				gs.compositions.load( cmp );
				resolve();
			};
			reader.readAsText( saveFile );
		}
	} );
};
