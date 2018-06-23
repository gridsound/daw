"use strict";

class waRender {
	constructor() {}
	on() {
		const dur = ~~Math.max( gs.currCmp.duration * env.sampleRate, 100 );

		this.isOn = true;
		this._ctx = wa.ctx;
		wa.ctx = new OfflineAudioContext( 2, dur, env.sampleRate );
		wa.synths.setContext( wa.ctx );
	}
	off() {
		wa.ctx = this._ctx;
		wa.synths.setContext( wa.ctx );
		delete this._ctx;
		delete this.isOn;
	}
}
