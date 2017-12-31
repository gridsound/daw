"use strict";

gs.init = function() {
	gs.currCmp = null;
	gs.currCmpSaved = true;
	gs.controls.init();
	gs.localStorage.getAll().forEach( function( cmp ) {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	} );
};
