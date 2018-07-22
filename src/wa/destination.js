"use strict";

class waDestination {
	constructor( ctx ) {
		this._ctx = ctx;
		this._appGain = ctx.createGain();
		this._appGain.connect( ctx.destination );
		this.analyser = ctx.createAnalyser();
		this.analyserData = new Uint8Array( 512 );
		this.analyser.fftSize = 1024;
		this.analyser.smoothingTimeConstant = 0; // default = .8
		this.analyser.connect( this._appGain );
		this.gain( env.def_appGain );
	}

	get() {
		return wa.ctx === this._ctx
			? this.analyser
			: wa.ctx.destination;
	}
	gain( v ) {
		this._appGain.gain.value = v * v;
	}
}
