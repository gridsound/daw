"use strict";

gs.loadCompositionById = function( cmpId ) {
	return gs.unloadComposition().then( function() {
		var cmp = gs.localStorage.get( cmpId );

		gs.loadComposition( cmp || gs.newComposition() );
		if ( !cmp ) {
			ui.patterns.open( gs.newPattern( false ) );
		}
	}, function() {} );
};
