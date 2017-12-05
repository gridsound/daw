"use strict";

gs.newSynth = function() {
	gs.pushCompositionChange( {
		synths: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "synth", "synths" ),
			oscillators: {
				[ common.smallId() ]: { order: 0, type: "sine", detune: 0, pan: 0, gain: 1 }
			}
		} }
	} );
};
