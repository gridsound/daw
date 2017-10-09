"use strict";

wa.grids = {
	currentTime() {
		if ( wa._scheduler ) {
			return wa._scheduler.currentTime();
		}
	},
	playMain( offset ) {
		wa.grids._play( offset );
	},
	playPattern( offset, id ) {
		wa.grids._play( offset, id );
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

	// private:
	_play( offset, id ) {
		var cmp = gs.currCmp,
			ctx = wa.ctx,
			pat = cmp.patterns[ id ],
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
		sched.setData( pat
			? wa.keysToScheduleData( cmp.keys[ pat.keys ], 0, 0, pat.duration )
			: wa.blocksToScheduleData() );
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
