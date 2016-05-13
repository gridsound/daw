"use strict";

ui.Sample.prototype.slip = function( offset ) {
	this.wsample.offset = Math.min( this.wbuff.buffer.duration, Math.max( offset, 0 ) );
	this.updateCSS_offset();
	return this;
};
