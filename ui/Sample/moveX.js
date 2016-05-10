"use strict";

ui.Sample.prototype.moveX = function( xem ) {
	this.xem = xem;
	this.when( xem / ui.BPMem );
	return this;
};
