"use strict";

gs.Sample.prototype.when = function( sec ) {
	this.wsample.when = sec;
	ui.CSS_sampleWhen( this );
};
