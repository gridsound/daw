"use strict";

gs.loadCompositionById = cmpId => {
	const cmp = gs.localStorage.get( cmpId );

	return cmp
		? gs.loadComposition( cmp )
		: gs.loadNewComposition();
};
