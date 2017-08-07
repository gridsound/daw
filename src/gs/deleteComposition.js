"use strict";

gs.deleteComposition = function( cmpId ) {
	var cmp0,
		isCurr = cmpId === gs.currCmp.id,
		cmp = isCurr ? gs.currCmp : gs.localStorage.get( cmpId ),
		msg = `Are you sure about deleting "${ cmp.name }" ? (no undo possible)`;

	if ( confirm( msg ) ) {
		gs.localStorage.delete( cmpId );
		ui.cmps.remove( cmpId );
		if ( isCurr ) {
			gs.currCmpSaved = true;
			cmp0 = gs.localStorage.getAll()[ 0 ];
			cmp0
				? gs.loadCompositionById( cmp0.id )
				: gs.loadNewComposition();
		}
	}
};
