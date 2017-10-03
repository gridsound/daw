"use strict";

wa.blocksToScheduleData = function() {
	var cmp = gs.currCmp,
		blocks = cmp.blocks;

	return Array.prototype.concat.apply( [],
		Object.keys( blocks ).map( function( blc ) {
			blc = blocks[ blc ];
			return wa.keysToScheduleData(
				cmp.keys[ cmp.patterns[ blc.pattern ].keys ], blc.when );
		} ) );
};
