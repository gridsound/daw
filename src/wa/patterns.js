"use strict";

wa.patterns = {
	init() {
		wa.patterns.list = {};
	},
	change( id, data ) {
		data
			? wa.patterns.list[ id ]
				? wa.patterns._update( id, data )
				: wa.patterns._add( id, data )
			: wa.patterns._remove( id );
	},
	stop() {
		wa.synth.stop();
	},
	play( id ) {
		var idKey, key,
			cmp = gs.currCmp,
			keys = cmp.keys[ cmp.patterns[ id ].keys ],
			bps = cmp.bpm / 60;

		for ( idKey in keys ) {
			key = keys[ idKey ];
			wa.synth.start(
				key.key.toUpperCase(),
				wa.ctx.currentTime + key.when / bps,
				0,
				key.duration / bps );
		}
	},

	// private:
	_add( id, data ) {
	},
	_update( id, data ) {
	},
	_remove( id ) {
	},
};
