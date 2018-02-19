"use strict";

wa.patternKeys = {
	start( midi ) {
		wa.synths.current.liveMidiKeyStart( midi );
	},
	stop( midi ) {
		wa.synths.current.liveMidiKeyStop( midi );
	}
};
