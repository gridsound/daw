"use strict";

wa.blocksToScheduleData = function( blocks ) {
	var pat,
		cmp = gs.currCmp,
		tracks = cmp.tracks;

	return Object.keys( blocks ).reduce( function( arr, blc ) {
		blc = blocks[ blc ];
		if ( !blc.track || tracks[ blc.track ].toggle ) {
			pat = cmp.patterns[ blc.pattern ];
			arr.push( {
				keys: gs.currCmp.keys[ pat.keys ],
				whenBeat: blc.when,
				offsetBeat: blc.offset,
				durationBeat: blc.duration
			} );
		}
		return arr;
	}, [] );
};
