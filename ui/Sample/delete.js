"use strict";

ui.Sample.prototype.delete = function() {
	this.jqSample.remove();
	wa.composition.removeSamples( [ this.wsample ] );
	return this;
};
