"use strict";

ui.Sample.prototype.updateBPMem = function() {
	this.wsample.when = this.xem / ui.BPMem;
	this.jqSample.css( "width", this.wbuff.buffer.duration * ui.BPMem + "em" );
	this.jqWaveform.css( "marginLeft", this.offset * ui.BPMem + "em" );
	return this;
};
