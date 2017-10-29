"use strict";

gs.loadCompositionById = function( cmpId ) {
	var cmp = gs.localStorage.get( cmpId );

	cmp ? gs.loadComposition( cmp )
		: gs.loadNewComposition();
	return false;
};
