"use strict";

wa.patternKeys = {
	start( key, oct ) {
		wa.synths.current.liveKeyStart( ( key + oct ).toUpperCase() );
	},
	stop( key, oct ) {
		wa.synths.current.liveKeyStop( ( key + oct ).toUpperCase() );
	}
};
