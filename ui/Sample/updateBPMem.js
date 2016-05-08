"use strict";

ui.Sample.prototype.updateBPMem = function() {
	// We don't have to call .updateCSS_when, the samples doesn't move when the BPM changes.
	this.wsample.when = this.xem / ui.BPMem;
	this.updateCSS_width();
	this.updateCSS_offset();
	return this;
};
