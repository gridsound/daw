"use strict";

ui.Sample.prototype.moveX = function( xem ) {
	this.jqSample.css( "left", xem + "em" );
	this.wsample.when = xem;
	return this;
};
