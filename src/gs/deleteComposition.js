"use strict";

gs.deleteComposition = function( cmpId ) {
	var cmp0, isCurr = cmpId === gs.currCmp.id;

	gs.localStorage.delete( cmpId );
	ui.cmps.remove( cmpId );
	if ( isCurr ) {
		gs.currCmpSaved = true;
		cmp0 = gs.localStorage.getAll()[ 0 ];
		cmp0
			? gs.loadCompositionById( cmp0.id )
			: gs.loadNewComposition();
	}
};
