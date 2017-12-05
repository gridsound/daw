"use strict";

jsonActions.removeSynth = function( synthId ) {
	var nbPat = 0,
		nbBlc = 0,
		keys = {},
		blocks = {},
		patterns = {},
		cmp = gs.currCmp,
		cmpBlocks = Object.entries( cmp.blocks ),
		data = { synths: { [ synthId ]: null } };

	Object.entries( cmp.patterns ).forEach( ( [ patId, pat ] ) => {
		if ( pat.synth === synthId ) {
			keys[ pat.keys ] =
			patterns[ patId ] = null;
			++nbPat;
			cmpBlocks.forEach( ( [ blcId, blc ] ) => {
				if ( blc.pattern === patId ) {
					blocks[ blcId ] = null;
					++nbBlc;
				}
			} );
		}
	} );
	if ( nbPat ) {
		data.keys = keys;
		data.patterns = patterns;
		if ( nbBlc ) {
			data.blocks = blocks;
		}
	}
	return data;
};
