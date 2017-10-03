"use strict";

wa.keysToScheduleData = function( keys, whenBeat ) {
	whenBeat = whenBeat || 0;
	return Object.keys( keys ).map( function( key ) {
		key = keys[ key ];
		return {
			key: key.key.toUpperCase(),
			whenBeat: key.when + whenBeat,
			offsetBeat: key.offset,
			durationBeat: key.duration
		};
	} );
};
