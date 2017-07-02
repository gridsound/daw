"use strict";

gs.deleteComposition = function( cmpId ) {
	var cmps,
		isCurr = cmpId === gs.currCmp.id,
		cmp = isCurr ? gs.currCmp : gs.localStorage.get( cmpId ),
		msg = `Are you sure about deleting "${ cmp.name }" ? (no undo possible)`;

	if ( confirm( msg ) ) {
		if ( isCurr ) {
			gs.currCmpSaved = true;
			gs.unloadComposition();
		}
		gs.localStorage.delete( cmpId );
		ui.cmps.remove( cmpId );
		if ( isCurr ) {
			cmps = gs.localStorage.getAll();
			gs.loadComposition( cmps[ 0 ] ? cmps[ 0 ].id : null );
		}
	}
};
