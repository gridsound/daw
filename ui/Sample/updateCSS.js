"use strict";

ui.Sample.prototype.updateCSS_when = function() {
	this.jqSample.css( "left", this.wsample.when * ui.BPMem + "em" );
	return this;
};

ui.Sample.prototype.updateCSS_offset = function() {
	this.jqWaveform.css( "marginLeft", -this.wsample.offset * ui.BPMem + "em" );
	return this;
};

ui.Sample.prototype.updateCSS_width = function() {
	this.jqSample.css( "width", this.wbuff.buffer.duration * ui.BPMem + "em" );
	return this;
};
