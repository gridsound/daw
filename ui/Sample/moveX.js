"use strict";

ui.Sample.prototype.moveX = function( xem ) {
	var prec = 1 / 4,
		rest = xem % prec;

	this.xem = xem;
	this.xemMagnet = xem - rest;
	if ( rest > prec / 2 ) {
		this.xemMagnet += prec;
	}

	if ( ui.isMagnetized ) {
		xem = this.xemMagnet;
	}

	this.jqSample.css( "left", xem + "em" );
	this.wsample.when = xem;
	return this;
};
