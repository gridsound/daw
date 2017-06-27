"use strict";

gs.saveCurrentComposition = function() {
	return !gs.currCmp || gs.currCmpSaved
		? Promise.resolve()
		: new Promise( function( res, rej ) {
			// ...
			gs.currCmpSaved = true;
			ui.cmpSaved( gs.currCmp, true );
			res();
		} );
};
