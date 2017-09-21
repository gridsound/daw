"use strict";

wa.init = function() {
	gswaSynth.assignDeep = common.assignDeep;
	wa.ctx = new AudioContext();
	wa.synth = new gswaSynth();
	wa.patterns.init();
	wa.synth.setContext( wa.ctx );
	wa.synth.connect( wa.ctx.destination );
	wa.synth.change( {
		oscillators: {
			"osc1": { type: "sine", detune: 0 }
		}
	} );
};
