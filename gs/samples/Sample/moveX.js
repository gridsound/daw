"use strict";

gs.Sample.prototype.moveX = function( xem ) {
	if ( this.wsample ) { // check wsample for empty sample
		this.xem = xem;
		this.when( xem / ui.BPMem );
	}
};