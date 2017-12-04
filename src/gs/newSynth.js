"use strict";

gs.newSynth = function() {
	gs.pushCompositionChange( {
		synths: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( "synth", "synths" ),
			oscillators: {}
		} }
	} );
};
