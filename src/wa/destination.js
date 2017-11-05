"use strict";

wa.destination = {
	init( ctx ) {
		this._ctx = ctx;
		this._appGain = ctx.createGain();
		this._appGain.gain.value = env.def_appGain;
		this._appGain.connect( ctx.destination );
	},
	get() {
		return wa.ctx === this._ctx
			? this._appGain
			: wa.ctx.destination;
	},
	gain( v ) {
		this._appGain.gain.value = v;
	}
};
