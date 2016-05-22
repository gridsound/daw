"use strict";

gs.Sample.prototype.delete = function() {
	this.wsample.stop();
	wa.composition.removeSamples( [ this.wsample ], "rm" );
	ui.CSS_sampleDelete( this );
};
