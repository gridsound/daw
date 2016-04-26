"use strict";

ui.Sample.prototype.select = function( b ) {
	this.selected = b;
	this.jqSample.toggleClass( "selected", b );
	return this;
};
