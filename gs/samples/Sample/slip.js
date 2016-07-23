"use strict";

gs.Sample.prototype.slip = function( offset ) {
	var ws = this.wsample;
	if ( ws ) {
		ws.offset = Math.min( ws.bufferDuration, Math.max( offset, 0 ) );
		ui.CSS_sampleOffset( this );
	}
};
