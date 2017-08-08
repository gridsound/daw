"use strict";

gs.removePattern = function( patId ) {
	gs.pushCompositionChange( {
		keys: { [ gs.currCmp.patterns[ patId ].keys ]: null },
		patterns: { [ patId ]: null }
	} );
};
