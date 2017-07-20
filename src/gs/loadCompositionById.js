"use strict";

gs.loadCompositionById = function( cmpId ) {
	return gs.unloadComposition().then( function() {
		gs.loadComposition(
			gs.localStorage.get( cmpId ) || gs.newComposition() );
	}, function() {} );
};
