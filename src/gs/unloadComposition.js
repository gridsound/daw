"use strict";

gs.unloadComposition = function() {
	return new Promise( function( res, rej ) {
		var cmpOrig,
			cmp = gs.currCmp,
			msg = "Are you sure to discard the unsaved change ?";

		if ( !cmp ) {
			res();
		} else {
			if ( !gs.currCmpSaved && ( !gs.history.length || confirm( msg ) ) ) {
				gs.currCmpSaved = true;
				cmpOrig = gs.localStorage.get( cmp.id );
				if ( cmpOrig ) {
					ui.cmps.saved( true );
					ui.cmps.update( cmp.id, cmpOrig );
				} else {
					ui.cmps.remove( cmp.id );
				}
			}
			if ( gs.currCmpSaved ) {
				gs.currCmp = null;
				gs.historyInd = 0;
				gs.history.length = 0;
				ui.history.cut( 0 );
				ui.controls.currentTime( 0 );
				ui.cmps.unload();
				ui.assets.empty();
				ui.gridKeys.empty();
				res();
			} else {
				rej();
			}
		}
	} );
};
