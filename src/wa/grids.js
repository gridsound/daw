"use strict";

wa.grids = {
	main: {
		play() {
			console.log( "wa.grids.main.play()" );
		},
		stop() {
			console.log( "wa.grids.main.stop()" );
		}
	},
	pattern: {
		play( id ) {
			var cmp = gs.currCmp,
				pat = cmp.patterns[ id ],
				sched = new gswaScheduler(),
				synth = new gswaSynth();

			wa._synthPattern = synth;
			wa._schedulerPattern = synth;
			synth.setContext( wa.ctx );
			synth.connect( wa.ctx.destination );
			synth.change( { oscillators: {
				"osc1": { type: "sine", detune: 0 }
			} } );
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
			if ( wa._synthPattern ) {
				wa._synthPattern.stop();
				wa._schedulerPattern.stop();
				delete wa._synthPattern;
				delete wa._schedulerPattern;
			}
		}
	}
};
