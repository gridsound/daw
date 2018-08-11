"use strict";

gs.deleteComposition = cmpId => {
	gs.localStorage.delete( cmpId );
	ui.cmps.remove( cmpId );
	if ( cmpId === gs.currCmp.id ) {
		const cmp0 = gs.localStorage.getAll()[ 0 ];

		gs.currCmpSaved = true;
		cmp0
			? gs.loadCompositionById( cmp0.id )
			: gs.loadNewComposition();
	}
};
