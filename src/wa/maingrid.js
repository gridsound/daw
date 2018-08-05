"use strict";

class waMainGrid {
	constructor() {
		const sch = new gswaScheduler();

		this.scheduler = sch;
		sch.currentTime = () => wa.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
		sch.onended = this._onendedBlocks.bind( this );
		this._startedSched = new Map();
		this._startedKeys = new Map();
	}

	empty() {
		const d = this.scheduler.data;

		Object.keys( d ).forEach( id => delete d[ id ] );
	}
	assignChange( data ) {
		common.assignDeep( this.scheduler.data, data );
		if ( gs.controls.loopA.main == null ) {
			this.scheduler.setLoopBeat( 0, gs.currCmp.duration || gs.currCmp.beatsPerMeasure );
		}
	}
	assignPatternChange( pat, keys ) {
		this._startedSched.forEach( sch => {
			if ( sch.pattern === pat ) {
				common.assignDeep( sch.data, keys );
			}
		} );
	}
	setLoop( a, b ) {
		if ( !Number.isFinite( a ) ) {
			a = 0;
			b = gs.currCmp.duration || gs.currCmp.beatsPerMeasure;
		}
		this.scheduler.setLoopBeat( a, b );
	}
	start( offset ) {
		const sch = this.scheduler;

		if ( wa.render.isOn ) {
			sch.clearLoop();
			sch.enableStreaming( false );
			sch.startBeat( 0 );
		} else {
			this.setLoop( gs.controls.loopA.main, gs.controls.loopB.main );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		}
	}

	// ........................................................................
	_onstartBlock( startedId, blc, when, off, dur ) {
		if ( gs.currCmp.tracks[ blc.track ].toggle ) {
			const cmp = gs.currCmp,
				pat = cmp.patterns[ blc.pattern ],
				sch = new gswaScheduler();

			this._startedSched.set( startedId, sch );
			sch.pattern = pat;
			sch.currentTime = () => wa.ctx.currentTime;
			sch.ondatastart = this._onstartKey.bind( this, pat.synth );
			sch.ondatastop = this._onstopKey.bind( this, pat.synth );
			sch.setBPM( cmp.bpm );
			Object.assign( sch.data, cmp.keys[ pat.keys ] );
			if ( wa.render.isOn ) {
				sch.enableStreaming( false );
			}
			sch.start( when, off, dur );
		}
	}
	_onstopBlock( startedId, blc ) {
		const sch = this._startedSched.get( startedId );

		if ( sch ) {
			sch.stop();
			this._startedSched.delete( startedId );
		}
	}
	_onendedBlocks( data ) {
		gs.controls.stop();
	}

	// ........................................................................
	_onstartKey( synthId, startedId, blc, when, off, dur ) {
		this._startedKeys.set( startedId,
			wa.synths._synths[ synthId ].startKey( blc.key, when, off, dur, blc.gain, blc.pan ) );
	}
	_onstopKey( synthId, startedId, blc ) {
		wa.synths._synths[ synthId ].stopKey( this._startedKeys.get( startedId ) );
		this._startedKeys.delete( startedId );
	}
}
