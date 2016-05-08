"use strict";

ui.Sample.prototype.when = function( sec ) {
	this.wsample.when = sec;
	this.updateCSS_when();
	return this;
};
