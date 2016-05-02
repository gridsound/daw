"use strict";

ui.Sample.prototype.updateWhen = function() {
	this.wsample.when = this.xem / ui.BPMem;
	return this;
};
