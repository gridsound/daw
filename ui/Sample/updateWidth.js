"use strict";

ui.Sample.prototype.updateWidth = function() {
	this.jqSample.css( "width",
		this.wbuff.buffer.duration * ui.BPMem + "em" );
	return this;
};
