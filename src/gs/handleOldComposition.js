"use strict";

gs.handleOldComposition = function( cmp ) {
	if ( !cmp.synths ) {
		var synthId = common.smallId();

		cmp.synths = { [ synthId ]: {
			name: "synth",
			oscillators: {
				[ common.smallId() ]: { type: "sine", detune: 0, pan: 0, gain: 1 }
			}
		} };
		cmp.synthOpened = synthId;
		Object.values( cmp.patterns ).forEach( pat => pat.synth = synthId );
	}
};
