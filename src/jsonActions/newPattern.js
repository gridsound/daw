"use strict";

function json_newPattern( cmp, synthId ) {
	const keysId = common.smallId();

	return {
		keys: { [ keysId ]: {} },
		patterns: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "pat", "patterns" ),
			type: "keys",
			keys: keysId,
			synth: synthId,
			duration: cmp.beatsPerMeasure,
		} }
	};
}
