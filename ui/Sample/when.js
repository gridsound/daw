"use strict";

ui.Sample.prototype.when = function( sec ) {
	this.wsample.when = sec;
	this.jqSample.css( "left", sec * ui.BPMem + "em" );
	return this;
};
