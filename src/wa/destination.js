"use strict";

wa.destination = {
	init( ctx ) {
		this._ctx = ctx;
		this._appGain = ctx.createGain();
		this._appGain.gain.value = env.def_appGain;
		this._appGain.connect( ctx.destination );
		wa.analyser = ctx.createAnalyser();
		wa.analyserData = new Uint8Array( 512 );
		wa.analyser.fftSize = 1024;
		wa.analyser.smoothingTimeConstant = .5; // default = .8
		wa.analyser.connect( this._appGain );
	},
	get() {
		return wa.ctx === this._ctx
			? wa.analyser
			: wa.ctx.destination;
	},
	gain( v ) {
		this._appGain.gain.value = v;
	}
};
