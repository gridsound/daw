"use strict";

ui.Sample.prototype.slip = function( offset ) {
	this.offset = Math.max( -this.wbuff.buffer.duration, Math.min( offset, 0 ) );
	this.updateCSS_offset();
	return this;
};
