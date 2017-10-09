"use strict";

wa.blocksToScheduleData = function() {
	var cmp = gs.currCmp,
		blocks = cmp.blocks;

	return Array.prototype.concat.apply( [],
		Object.keys( blocks ).reduce( function( res, blc ) {
			blc = blocks[ blc ];
			if ( cmp.tracks[ blc.track ].toggle ) {
				res.push( wa.keysToScheduleData(
					cmp.keys[ cmp.patterns[ blc.pattern ].keys ],
					blc.when, blc.offset, blc.duration ) );
			}
			return res;
		}, [] ) );
};
