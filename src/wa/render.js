"use strict";

wa.render = {
	on() {
		var cmp = gs.currCmp;

		this.isOn = true;
		this._ctx = wa.ctx;
		wa.ctx = new OfflineAudioContext( 2,
			~~Math.max( cmp.duration / ( cmp.bpm / 60 ) * env.sampleRate, 100 ), env.sampleRate );
		wa.synths.setContext( wa.ctx );
	},
	off() {
		wa.ctx = this._ctx;
		wa.synths.setContext( wa.ctx );
		delete this._ctx;
		delete this.isOn;
	}
};
