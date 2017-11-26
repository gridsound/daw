"use strict";

wa.init = function() {
	gswaSynth.assignDeep = common.assignDeep;
	wa.ctx = new AudioContext();
	wa.synth = new gswaSynth();
	wa.destination.init( wa.ctx );
	wa.synth.setContext( wa.ctx );
	wa.synth.connect( wa.ctx.destination );
	wa.synth.change( {
		oscillators: {
			"osc1": { type: "sine", detune: 0, pan: 0, gain: 1 }
		}
	} );
};
