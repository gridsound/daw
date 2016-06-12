"use strict";

gs.Sample.prototype.delete = function() {
	this.wsample.stop();
	this.track.removeSample( this );
	wa.composition.removeSamples( [ this.wsample ], "rm" );
	ui.CSS_sampleDelete( this );
};
