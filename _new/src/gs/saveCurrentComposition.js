"use strict";

gs.saveCurrentComposition = function() {
	return gs.currCmpSaved
		? Promise.resolve()
		: new Promise( function( res, rej ) {
			// ...
			gs.currCmpSaved = true;
			res();
		} );
};
