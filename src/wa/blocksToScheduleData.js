"use strict";

wa.blocksToScheduleData = function( blocks ) {
	var cmp = gs.currCmp,
		tracks = cmp.tracks;

	return Object.keys( blocks ).reduce( function( arr, blc ) {
		blc = blocks[ blc ];
		if ( !blc.track || tracks[ blc.track ].toggle ) {
			arr.push( {
				pattern: cmp.patterns[ blc.pattern ],
				whenBeat: blc.when,
				offsetBeat: blc.offset,
				durationBeat: blc.duration
			} );
		}
		return arr;
	}, [] );
};
