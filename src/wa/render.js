"use strict";

wa.render = {
	on() {
		var cmp = gs.currCmp;

		wa.render.isOn = true;
		wa.render._ctx = wa.ctx;
		wa.ctx = new OfflineAudioContext( 2,
			~~Math.max( cmp.duration / ( cmp.bpm / 60 ) * env.sampleRate, 100 ), env.sampleRate );
		wa.synths.setContext( wa.ctx );
	},
	off() {
		wa.ctx = wa.render._ctx;
		wa.synths.setContext( wa.ctx );
		delete wa.render._ctx;
		delete wa.render.isOn;
	}
};
