"use strict";

gs.Sample.prototype.duration = function( dur ) {
	this.wsample.duration = Math.max( 0, Math.min( dur, this.wsample.bufferDuration ) );
	ui.CSS_sampleDuration( this );
};
