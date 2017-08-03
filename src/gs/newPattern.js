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

	if ( pushToHist === false ) {
		gs.changeComposition( obj );
	} else {
		gs.pushCompositionChange( obj );
	}
	return patId;
};
