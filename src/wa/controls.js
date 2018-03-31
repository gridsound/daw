"use strict";

wa.controls = {
	init() {
		this._times = {
			main: {},
			pattern: {}
		};
	},

	focusOn( grid ) {
		const wasStarted = this._currSched && this._currSched.started;

		wasStarted && this.stop();
		this._currTimes = this._times[ grid ];
		this._currSched = grid === "main"
			? wa.maingrid.scheduler
			: wa.pianoroll.scheduler;
		wasStarted && this.start( this._currTimes.offset );
	},
	setLoop( a, b ) {
		if ( a === false ) {
			this._currSched.clearLoop();
		} else {
			this._currSched.setLoopBeat( a, b );
		}
	},
	setBPM( bpm ) {
		wa.maingrid.scheduler.setBPM( bpm );
		wa.pianoroll.scheduler.setBPM( bpm );
	},
	getCurrentTime() {
		return this._currTimes.offset = this._currSched.getCurrentOffsetBeat();
	},
	setCurrentTime( off ) {
		this._currTimes.offset = off;
		this._currSched.setCurrentOffsetBeat( off );
	},
	stop() {
		this._currSched.stop();
	},
	start( off ) {
		if ( this._currTimes === this._times.main ) {
			wa.maingrid.start( off );
		} else {
			wa.pianoroll.start( off );
		}
	}
};
