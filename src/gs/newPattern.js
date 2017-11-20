"use strict";

gs.newPattern = function() {
	var keysId = common.smallId();

	gs.pushCompositionChange( {
		keys: { [ keysId ]: {} },
		patterns: { [ common.smallId() ]: {
			name: gs.namePattern( "pat" ),
			type: "keys",
			keys: keysId,
			duration: gs.currCmp.beatsPerMeasure
		} }
	} );
};
