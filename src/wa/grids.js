"use strict";

wa.grids = {
	currentTime() {
		if ( wa._scheduler ) {
			return wa._scheduler.currentTime();
		}
	},
	playMain() {
		console.log( "wa.grids.main.play()" );
	},
	playPattern( id ) {
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
		sched.setData( wa.keysToScheduleData( cmp.keys[ pat.keys ] ) );
		sched.setBPM( cmp.bpm );
		sched.onstart = function( smp, when, offset, duration ) {
			synth.start( smp.key.toUpperCase(), wa.ctx.currentTime + when, offset, duration );
		};
		sched.onended = function( data ) {
			gs.controls.stop();
		};
		sched.start();
	},
	stop() {
		if ( wa._synth ) {
			wa._synth.stop();
			wa._scheduler.stop();
			delete wa._synth;
			delete wa._scheduler;
		}
	}
};
