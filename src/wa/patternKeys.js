"use strict";

wa.patternKeys = {
	start( key, oct ) {
		wa.synths.current.simpleStart( ( key + oct ).toUpperCase() );
	},
	stop() {
		wa.synths.current.stop();
	}
};
