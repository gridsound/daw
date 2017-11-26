"use strict";

wa.patterns = {
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
	}
};
