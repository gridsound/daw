"use strict";

ui.Sample.prototype.setWidth = function( wem ) {
	this.jqSample.css( "width", wem + "em" );
	return this;
};
