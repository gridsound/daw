"use strict";

wa.grids = {
	currentTime() {
		if ( wa._scheduler ) {
			return wa._scheduler.currentTime();
		}
	},
	stop() {
		if ( wa._synth ) {
			delete wa._scheduler.onended;
			wa._scheduler.stop();
			wa._synth.stop();
			delete wa._synth;
			delete wa._scheduler;
		}
	},
	replay( beat ) {
		if ( gs.controls.status === "playing" ) {
			beat = beat != null ? beat : wa.grids.currentTime();
			wa.grids.stop();
			wa.grids.play( gs.controls._grid, beat );
		}
	},
	play( grid, offset ) {
		var pat,
			cmp = gs.currCmp,
			ctx = wa.ctx,
			synth = new gswaSynth(),
			sched = new gswaScheduler();

		wa._synth = synth;
		wa._scheduler = sched;
		synth.setContext( ctx );
		synth.connect( ctx.destination );
		synth.change( { oscillators: {
			"osc1": { type: "sine", detune: 0 }
		} } );
		sched.setContext( ctx );
		if ( grid === "main" ) {
			sched.setData( wa.blocksToScheduleData() );
		} else {
			pat = cmp.patterns[ gs.currCmp.patternOpened ];
			sched.setData( wa.keysToScheduleData( cmp.keys[ pat.keys ], 0, 0, pat.duration ) );
		}
		sched.setBPM( cmp.bpm );
		sched.onstart = function( smp, when, offset, duration ) {
			synth.start( smp.key, ctx.currentTime + when, offset, duration );
		};
		sched.onended = function( data ) {
			gs.controls.stop();
		};
		sched.startBeat( 0, offset );
	}
};
