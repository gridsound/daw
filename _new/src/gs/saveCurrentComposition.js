"use strict";

gs.saveCurrentComposition = function() {
	return gs.currCmpSaved
		? Promise.resolve()
		: new Promise( function( res, rej ) {
			var cmp = gs.currCmp;

			cmp.savedAt = ~~( Date.now() / 1000 );
			gs.currCmpSaved = true;
			ui.cmpSaved( cmp, true );
			res();
		} );
};
