"use strict";

gs.Sample.prototype.slip = function( offset ) {
	this.wsample.offset = Math.min( this.wbuff.buffer.duration, Math.max( offset, 0 ) );
	ui.CSS_sampleOffset( this );
};
