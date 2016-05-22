"use strict";

gs.Sample.prototype.duration = function( dur ) {
	// this.wsample.bufferDuration ?
	this.wsample.duration = Math.max( 0, dur );
	ui.CSS_sampleDuration( this );
};
