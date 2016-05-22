"use strict";

gs.Sample.prototype.select = function( b ) {
	this.selected = b;
	ui.CSS_sampleSelect( this );
};
