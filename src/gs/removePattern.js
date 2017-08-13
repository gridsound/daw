"use strict";

gs.removePattern = function( patId ) {
	var bId,
		filled,
		gsBlocks = gs.currCmp.blocks,
		blocks = {},
		data = {
			keys: { [ gs.currCmp.patterns[ patId ].keys ]: null },
			patterns: { [ patId ]: null }
		};

	for ( bId in gsBlocks ) {
		if ( gsBlocks[ bId ].pattern === patId ) {
			blocks[ bId ] = null;
			filled = true;
		}
	}
	if ( filled ) {
		data.blocks = blocks;
	}
	gs.pushCompositionChange( data );
};
