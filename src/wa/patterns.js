"use strict";

wa.patterns = {
	stop() {
		if ( wa.patterns._synth ) {
			wa.patterns._synth.stop();
			delete wa.patterns._synth;
		}
	},
	play( id ) {
		var cmp = gs.currCmp,
			bps = cmp.bpm / 60,
			pat = cmp.patterns[ id ],
			keys = cmp.keys[ pat.keys ],
			synth = cmp.synths[ pat.synth ],
			waSynth = new gswaSynth();

		waSynth.setContext( wa.ctx );
		waSynth.connect( wa.destination.get() );
		waSynth.change( synth );
		Object.values( keys ).forEach( key => {
			wa.patterns._synth = waSynth;
			waSynth.start(
				key.key,
				wa.ctx.currentTime + key.when / bps,
				0, key.duration / bps );
		} );
	}
};
