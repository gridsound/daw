"use strict";

wa.patternKeys = {
	start( key, oct ) {
		wa.synth.simpleStart( ( key + oct ).toUpperCase() );
	},
	stop() {
		wa.synth.stop();
	}
};
