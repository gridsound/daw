"use strict";

gs.Sample.prototype.delete = function() {
	if ( this.wsample ) { // check wsample for empty sample
		this.wsample.stop();
		this.track.removeSample( this );
		wa.composition.removeSamples( [ this.wsample ], "rm" );
		ui.CSS_sampleDelete( this );
	}
};
