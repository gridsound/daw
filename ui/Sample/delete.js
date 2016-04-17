"use strict";

ui.Sample.prototype.delete = function() {
	this.jqSample.remove();
	return this;
};
