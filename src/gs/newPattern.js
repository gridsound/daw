"use strict";

gs.newPattern = function( pushToHist ) {
	var keysId = common.uuid(),
		patId = common.uuid();

	( pushToHist === false
		? gs.changeComposition
		: gs.pushCompositionChange )( {
			keys: { [ keysId ]: {} },
			patterns: { [ patId ]: {
				name: gs.namePattern( "pat" ),
				type: "keys",
				keys: keysId,
				duration: gs.currCmp.beatsPerMeasure
			} }
		} );
	return patId;
};
