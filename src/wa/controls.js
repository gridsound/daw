"use strict";

class waControls {
	constructor() {
		this._times = {
			main: {},
			pattern: {},
		};
	}

	focusOn( grid ) {
		const wasStarted = this._sch && this._sch.started;

		wasStarted && this.stop();
		this._currTimes = this._times[ grid ];
		this._currGrid = grid === "main" ? wa.mainGrid : wa.pianoroll;
		this._sch = this._currGrid.scheduler;
		wasStarted && this.start( this._currTimes.offset );
	}
	setLoop( a, b ) {
		const sch = this._sch;

		a === false
			? sch.clearLoop()
			: sch.setLoopBeat( a, b );
	}
	setBPM( bpm ) {
		wa.mainGrid.scheduler.setBPM( bpm );
		wa.pianoroll.scheduler.setBPM( bpm );
	}
	getCurrentTime() {
		return this._currTimes.offset = this._sch.getCurrentOffsetBeat();
	}
	setCurrentTime( off ) {
		this._currTimes.offset = off;
		this._sch.setCurrentOffsetBeat( off );
	}
	stop() {
		this._sch.stop();
	}
	start( off ) {
		this._currGrid.start( off );
	}
}
