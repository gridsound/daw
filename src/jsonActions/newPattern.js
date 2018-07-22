"use strict";

jsonActions.newPattern = function( synthId ) {
	var keysId = common.smallId();

	return {
		keys: { [ keysId ]: {} },
		patterns: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "pat", "patterns" ),
			type: "keys",
			keys: keysId,
			synth: synthId,
			duration: gs.currCmp.beatsPerMeasure
		} }
	};
};
