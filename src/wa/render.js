"use strict";

class waRender {
	on() {
		const dur = Math.ceil( gs.currCmp.duration * 60 / gs.currCmp.bpm ) || 1;

		this.isOn = true;
		this._ctx = wa.ctx;
		wa.ctx = new OfflineAudioContext( 2, ~~( dur * env.sampleRate ), env.sampleRate );
		wa.synths.setContext( wa.ctx );
	}
	off() {
		wa.ctx = this._ctx;
		wa.synths.setContext( wa.ctx );
		delete this._ctx;
		delete this.isOn;
	}
}
