"use strict";

wa.grids = {
	currentTime() {
		if ( wa._scheduler ) {
			return wa._scheduler.currentTime();
		}
	},
	playMain() {
		wa.grids._play()
	},
	playPattern( id ) {
		wa.grids._play( id )
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
	_play( id ) {
		var cmp = gs.currCmp,
			pat = cmp.patterns[ id ],
			synth = new gswaSynth(),
			sched = new gswaScheduler();

		wa._synth = synth;
		wa._scheduler = sched;
		synth.setContext( wa.ctx );
		synth.connect( wa.ctx.destination );
		synth.change( { oscillators: {
			"osc1": { type: "sine", detune: 0 }
		} } );
		sched.setContext( wa.ctx );
		sched.setData( pat
			? wa.keysToScheduleData( cmp.keys[ pat.keys ], 0, 0, pat.duration )
			: wa.blocksToScheduleData() );
		sched.setBPM( cmp.bpm );
		sched.onstart = function( smp, when, offset, duration ) {
			synth.start( smp.key, wa.ctx.currentTime + when, offset, duration );
		};
		sched.onended = function( data ) {
			gs.controls.stop();
		};
		sched.start();
	}
};
