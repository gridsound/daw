"use strict";

gs.sample.duration = function( smp, dur ) {
	smp.duration = Math.max( 0, Math.min( dur, smp.bufferDuration ) );
	ui.sample.duration( smp );
};
