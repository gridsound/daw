"use strict";

gs.saveCurrentComposition = function() {
	return gs.currCmpSaved
		? Promise.resolve()
		: new Promise( function( res, rej ) {
			var cmp = gs.currCmp;

			cmp.savedAt = ~~( Date.now() / 1000 );
			gs.localStorage.put( cmp.id, cmp );
			if ( gs.historyActionSaved ) {
				delete gs.historyActionSaved.saved;
			}
			if ( gs.historyActionSaved = gs.history[ gs.historyInd - 1 ] ) {
				gs.historyActionSaved.saved = true;
			}
			gs.currCmpSaved = true;
			ui.cmps.saved( true );
			res();
		} );
};
