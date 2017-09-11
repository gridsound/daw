"use strict";

gs.newPattern = function( pushToHist ) {
	var keysId = common.smallId(),
		patId = common.smallId();

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
