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
		var cmp = gs.currCmp,
			synth = new gswaSynth(),
			sched = new gswaScheduler();

		wa._synth = synth;
		wa._scheduler = sched;
		sched.onstart = wa.grids._onstartBlock;
		sched.onstop = wa.grids._onstopBlock;
		sched.onended = wa.grids._onendedBlocks;
		sched.setContext( wa.ctx );
		synth.setContext( wa.ctx );
		synth.connect( wa.ctx.destination );
		synth.change( { oscillators: {
			"osc1": { type: "sine", detune: 0 }
		} } );
		sched.setData( grid === "main"
			? wa.blocksToScheduleData( cmp.blocks )
			: wa.blocksToScheduleData( { "_": {
				pattern: cmp.patternOpened,
				when: 0,
				offset: 0,
				duration: cmp.patterns[ cmp.patternOpened ].duration
			} } ) );
		sched.setBPM( cmp.bpm );
		sched.startBeat( 0, offset, null, gs.controls.loopA[ grid ], gs.controls.loopB[ grid ] );
		sched.setBPM( cmp.bpm );
	},

	// private:
	_onstartKey( smp, when, offset, dur ) {
		wa._synth.start( smp.key, when, offset, dur );
	},
	_onstartBlock( smp, when, offset, dur ) {
		var sched = new gswaScheduler();

		smp.scheduler = sched;
		sched.onstart = wa.grids._onstartKey;
		sched.setContext( wa.ctx );
		sched.setData( wa.keysToScheduleData( smp.keys ) );
		sched.setBPM( gs.currCmp.bpm );
		sched.start( when, offset, dur );
	},
	_onstopBlock( smp ) {
		smp.scheduler.stop();
	},
	_onendedBlocks( data ) {
		gs.controls.stop();
	}
};
