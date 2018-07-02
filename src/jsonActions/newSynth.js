"use strict";

jsonActions.newSynth = function() {
	return {
		synths: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "synth", "synths" ),
			envelopes: {
				gain: {
					attack: { duration: .02, value: "" },
					release: { duration: .02, value: "" }
				},
				pan: {
					attack: { duration: .02, value: "" },
					release: { duration: .02, value: "" }
				}
			},
			oscillators: {
				[ common.smallId() ]: { order: 0, type: "sine", detune: 0, pan: 0, gain: 1 }
			}
		} }
	};
};
