"use strict";

ui.Sample.prototype.slip = function( xem ) {
	this.offsetEm = Math.min( this.offsetEm + xem, 0 );
	this.jqWaveform.css( "marginLeft", this.offsetEm + "em" );
	return this;
};
