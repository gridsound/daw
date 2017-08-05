"use strict";

gs.newPattern = function( pushToHist ) {
	var keysId = common.uuid(),
		patId = common.uuid(),
		patName = "pat " + ++gs.patternIdAbs;

	( pushToHist === false
		? gs.changeComposition
		: gs.pushCompositionChange )( {
			keys: { [ keysId ]: {} },
			patterns: {
				[ patId ]: { name: patName, type: "keys", keys: keysId, duration: 0 }
			}
		} );
	return patId;
};
