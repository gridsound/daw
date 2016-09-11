"use strict";

gs.Sample.prototype.select = function( b ) {

	// Don't let the unloaded samples to be selected.
	this.selected = !b ? false : !!this.wsample;
	ui.CSS_sampleSelect( this );
};
