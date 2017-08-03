"use strict";

gs.newPattern = function( pushToHist ) {
	var keysId = common.uuid(),
		patId = common.uuid(),
		patName = "pat " + ++gs.patternIdAbs,
		obj = {
			patterns: {
				[ patId ]: { name: patName, type: "keys", keys: keysId, duration: 0 }
			},
			keys: {
				[ keysId ]: {}
			}
		};

	if ( pushToHist ) {
		gs.pushCompositionChange( obj );
	} else {
		gs.changeComposition( obj );
	}
	return patId;
};
