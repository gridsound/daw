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
			gs.unloadComposition().then( function() {
				gs.loadComposition( cmp );
				res();
			}, rej );
		};
		reader.readAsText( blob );
	} );
};
