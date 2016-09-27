"use strict";

gs.Sample.prototype.delete = function() {
	if ( this.wsample ) { // check wsample for empty sample
		this.wsample.stop();
		this.track.removeSample( this );
		this.oldTrack = this.track; // for the undo
		this.track = undefined;
		wa.composition.removeSamples( [ this.wsample ], "rm" );
		ui.CSS_sampleDelete( this );
	}
};
