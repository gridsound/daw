"use strict";

function json_newSynth( cmp ) {
	return {
		synths: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "synth", "synths" ),
			oscillators: {
				[ common.smallId() ]: {
					order: 0,
					type: "sine",
					detune: 0,
					pan: 0,
					gain: 1,
				}
			}
		} }
	};
}
