"use strict";

wa.init = function() {
	gswaSynth.assignDeep = common.assignDeep;
	wa.ctx = new AudioContext();
	wa.destination.init( wa.ctx );
	wa.synths.init();
};
