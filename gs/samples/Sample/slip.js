"use strict";

gs.sample.slip = function( smp, offset ) {
	var ws = smp.wsample;

	if ( ws ) { // TODO: #emptySample
		ws.offset = Math.min( ws.bufferDuration, Math.max( offset, 0 ) );
		ui.CSS_sampleOffset( smp );
	}
};
