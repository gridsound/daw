"use strict";

gs.updatePatternContent = function( id ) {
	var blocks, block, bId,
		pat = gs.currCmp.patterns[ id ],
		data = ui.keysToRects( gs.currCmp.keys[ pat.keys ] ),
		dur = data.duration;

	if ( pat.duration !== dur ) {
		pat.duration = dur;
		blocks = gs.currCmp.blocks;
		for ( bId in blocks ) {
			block = blocks[ bId ];
			if ( block.pattern === id && !block.durationEdited ) {
				block.duration = dur;
			}
		}
	}
	ui.patterns.updateContent( id, data );
};
