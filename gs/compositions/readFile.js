"use strict";

gs.compositions.readFile = function( saveFile ) {
	return new Promise( function( resolve, reject ) {
		if ( !saveFile ) {
			resolve();
		} else {
			var reader = new FileReader();

			reader.onload = function( e ) {
				gs.compositions.load( JSON.parse( e.target.result ) );
				resolve();
			};
			reader.readAsText( saveFile );
		}
	} );
};
