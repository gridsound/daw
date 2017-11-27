"use strict";

wa.keysToScheduleData = function( pat ) {
	return Object.values( gs.currCmp.keys[ pat.keys ] )
		.map( key => ( {
			synthId: pat.synth,
			key: key.key.toUpperCase(),
			whenBeat: key.when,
			offsetBeat: key.offset,
			durationBeat: key.duration
		} ) );
};
