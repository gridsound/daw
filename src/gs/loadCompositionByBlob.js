"use strict";

gs.loadCompositionByBlob = function( blob ) {
	return new Promise( function( res, rej ) {
		var cmp, reader = new FileReader();

		reader.onload = function() {
			try {
				cmp = JSON.parse( reader.result );
			} catch( e ) {
				rej();
				return;
			}
			gs.loadComposition( cmp ).then( res, rej );
		};
		reader.readAsText( blob );
	} );
};
