"use strict";

gs.sample.duration = function( smp, dur ) {
	if ( smp.wsample ) { // TODO: #emptySample
		smp.wsample.duration = Math.max( 0, Math.min( dur, smp.wsample.bufferDuration ) );
		ui.CSS_sampleDuration( smp );
	}
};
