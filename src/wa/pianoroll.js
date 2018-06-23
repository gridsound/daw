"use strict";

class waPianoroll {
	constructor() {
		const sch = new gswaScheduler();

		this.scheduler = sch;
		sch.currentTime = () => wa.ctx.currentTime;
		sch.ondatastart = this._startKey.bind( this );
		sch.ondatastop = this._stopKey.bind( this );
		this._keysStarted = {};
		this._keysStartedLive = {};
	}

	// ........................................................................
	assignPattern( id ) {
		this.scheduler.empty();
		this._pattern = gs.currCmp.patterns[ id ];
		this.assignPatternChange( gs.currCmp.keys[ this._pattern.keys ] );
	}
	assignPatternChange( data ) {
		common.assignDeep( this.scheduler.data, data );
		if ( gs.controls.loopA.pattern == null ) {
			const beatPM = gs.currCmp.beatsPerMeasure,
				b = Math.ceil( this._pattern.duration / beatPM );

			this.scheduler.setLoopBeat( 0, Math.max( 1, b ) * beatPM );
		}
	}
	start( off ) {
		const cmp = gs.currCmp;
		let a = gs.controls.loopA.pattern,
			b = gs.controls.loopB.pattern;

		if ( a == null ) {
			a = 0;
			b = Math.ceil( this._pattern.duration / cmp.beatsPerMeasure );
			b = Math.max( 1, b ) * cmp.beatsPerMeasure;
		}
		this.scheduler.setLoopBeat( a, b );
		if ( this._pattern ) {
			this.scheduler.startBeat( 0, off );
		}
	}
	liveStartKey( midi ) {
		if ( !( midi in this._keysStartedLive ) ) {
			this._keysStartedLive[ midi ] =
				wa.synths.current.startKey( midi, 0, 0, Infinity );
		}
	}
	liveStopKey( midi ) {
		wa.synths.current.stopKey( this._keysStartedLive[ midi ] )
		delete this._keysStartedLive[ midi ];
	}

	// ........................................................................
	_startKey( startedId, blc, when, off, dur ) {
		this._keysStarted[ startedId ] =
			wa.synths.current.startKey( blc.key, when, off, dur );
	}
	_stopKey( startedId, blc ) {
		wa.synths.current.stopKey( this._keysStarted[ startedId ] );
		delete this._keysStarted[ startedId ];
	}
}
