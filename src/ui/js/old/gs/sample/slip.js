"use strict";

gs.sample.slip = function( smp, offset ) {
	smp.offset = Math.min( smp.bufferDuration, Math.max( offset, 0 ) );
	ui.sample.waveform( smp );
};
