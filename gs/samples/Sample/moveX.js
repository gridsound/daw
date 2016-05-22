"use strict";

gs.Sample.prototype.moveX = function( xem ) {
	this.xem = xem;
	this.when( xem / ui.BPMem );
};
