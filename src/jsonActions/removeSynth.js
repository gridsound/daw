"use strict";

function json_removeSynth( cmp, synthId ) {
	const keys = {},
		blocks = {},
		patterns = {},
		cmpBlocks = Object.entries( cmp.blocks ),
		data = { synths: { [ synthId ]: null } };
	let filledPat,
		filledBlcs;

	Object.entries( cmp.patterns ).forEach( ( [ patId, pat ] ) => {
		if ( pat.synth === synthId ) {
			keys[ pat.keys ] =
			patterns[ patId ] = null;
			filledPat = true;
			cmpBlocks.forEach( ( [ blcId, blc ] ) => {
				if ( blc.pattern === patId ) {
					blocks[ blcId ] = null;
					filledBlcs = true;
				}
			} );
		}
	} );
	if ( filledPat ) {
		data.keys = keys;
		data.patterns = patterns;
		if ( filledBlcs ) {
			data.blocks = blocks;
		}
	}
	return data;
}
