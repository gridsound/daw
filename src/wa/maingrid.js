"use strict";

wa.maingrid = {
	init() {
		const sch = new gswaScheduler();

		this.scheduler = sch;
		sch.currentTime = () => wa.ctx.currentTime;
		sch.ondatastart = this._onstartBlock.bind( this );
		sch.ondatastop = this._onstopBlock.bind( this );
		sch.onended = this._onendedBlocks.bind( this );
		this._startedSched = {};
		this._startedKeys = {};
	},

	empty() {
		const d = this.scheduler.data;

		Object.keys( d ).forEach( id => delete d[ id ] );
	},
	assignChange( data ) {
		common.assignDeep( this.scheduler.data, data );
		if ( gs.controls.loopA.main == null ) {
			this.scheduler.setLoopBeat( 0, this._getDurationBeat() );
		}
	},
	assignPatternChange( pat, keys ) {
		Object.values( this._startedSched )
			.forEach( sch => sch.pattern === pat &&
				common.assignDeep( sch.data, keys ) );
	},
	start( offset ) {
		if ( wa.render.isOn ) {
			this.scheduler.startBeat( 0 );
		} else {
			let a = gs.controls.loopA.main,
				b = gs.controls.loopB.main;

			if ( a == null ) {
				a = 0;
				b = this._getDurationBeat();
			}
			this.scheduler.setLoopBeat( a, b );
			this.scheduler.startBeat( 0, offset );
		}
	},

	// ........................................................................
	_getDurationBeat() {
		const beatPM = gs.currCmp.beatsPerMeasure,
			b = this.scheduler.duration * this.scheduler.bps;

		return Math.max( 1, Math.ceil( b / beatPM ) ) * beatPM;
	},
	_onstartBlock( startedId, blc, when, off, dur ) {
		const cmp = gs.currCmp,
			pat = cmp.patterns[ blc.pattern ],
			sch = new gswaScheduler();

		this._startedSched[ startedId ] = sch;
		sch.pattern = pat;
		sch.currentTime = () => wa.ctx.currentTime;
		sch.ondatastart = this._onstartKey.bind( this, pat.synth );
		sch.ondatastop = this._onstopKey.bind( this, pat.synth );
		sch.setBPM( cmp.bpm );
		Object.assign( sch.data, cmp.keys[ pat.keys ] );
		sch.start( when, off, dur );
	},
	_onstopBlock( startedId, blc ) {
		this._startedSched[ startedId ].stop();
		delete this._startedSched[ startedId ];
	},
	_onendedBlocks( data ) {
		gs.controls.stop();
	},

	// ........................................................................
	_onstartKey( synthId, startedId, blc, when, off, dur ) {
		this._startedKeys[ startedId ] =
			wa.synths._synths[ synthId ].startKey( blc.key, when, off, dur );
	},
	_onstopKey( synthId, startedId, blc ) {
		wa.synths._synths[ synthId ].stopKey( this._startedKeys[ startedId ] );
		delete this._startedKeys[ startedId ];
	}
};
