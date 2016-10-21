"use strict";

gs.sample.delete = function( smp ) {
	smp.stop();
	smp.data.track.removeSample( smp );
	smp.data.oldTrack = smp.data.track; // TODO: #undo
	smp.data.track = undefined;
	wa.composition.remove( smp );
	ui.CSS_sampleDelete( smp );
};
