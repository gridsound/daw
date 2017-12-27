"use strict";

gs.init = function() {
	gs.undoredo = new Undoredo();
	gs.undoredo.onchange = function( obj, path, val, previousVal ) {
		lg( "onchange", path, val, previousVal );
	};
	gs.history = [];
	gs.historyInd = 0;
	gs.currCmp = null;
	gs.currCmpSaved = true;
	gs.controls.init();
	gs.localStorage.getAll().forEach( function( cmp ) {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	} );
};
