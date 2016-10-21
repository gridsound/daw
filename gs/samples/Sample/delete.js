"use strict";

gs.sample.delete = function( smp ) {
	if ( smp.wsample ) { // TODO: #emptySample
		smp.wsample.stop();
		smp.track.removeSample( smp );
		smp.oldTrack = smp.track; // TODO: #undo
		smp.track = undefined;
		wa.composition.remove( smp.wsample );
		ui.CSS_sampleDelete( smp );
	}
};
