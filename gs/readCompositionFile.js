"use strict";

gs.readCompositionFile = function( saveFile ) {
	return new Promise( function( resolve, reject ) {
		if ( !saveFile ) {
			resolve();
		} else {
			var reader = new FileReader();

			reader.onload = function( e ) {
				gs.load( JSON.parse( e.target.result ) );
				resolve();
			};
			reader.readAsText( saveFile );
		}
	} );
};
