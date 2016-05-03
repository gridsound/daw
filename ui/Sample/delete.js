"use strict";

ui.Sample.prototype.delete = function() {
	this.jqSample.remove();
	this.wsample.stop();
	wa.composition.removeSamples( [ this.wsample ] );
	return this;
};
