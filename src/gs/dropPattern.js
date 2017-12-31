"use strict";

gs.dropPattern = function( patId, trkId, when ) {
	gs.undoredo.change( {
		blocks: { [ common.smallId() ]: {
			pattern: patId,
			track: trkId,
			when: when,
			offset: 0,
			duration: gs.currCmp.patterns[ patId ].duration
		} }
	} );
};
