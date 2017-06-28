"use strict";

gs.init = function() {
	ui.init();
	gs.history = [];
	gs.historyInd = 0;
	gs.currCmp = null;
	gs.currCmpSaved = true;
	gs.localStorage.getAll().sort( function( a, b ) {
		return a.savedAt < b.savedAt;
	} ).forEach( function( cmp ) {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	} );
};
