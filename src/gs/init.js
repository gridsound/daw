"use strict";

gs.init = () => {
	gs.currCmp = null;
	gs.currCmpSaved = true;
	gs.controls.init();
	gs.localStorage.getAll().forEach( cmp => {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	} );
};
