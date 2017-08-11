"use strict";

gs.updatePatternContent = function( id ) {
	var pat = gs.currCmp.patterns[ id ],
		data = gs.keysToRects( gs.currCmp.keys[ pat.keys ] );

	pat.duration = data.duration;
	ui.patterns.updateContent( id, data );
};
