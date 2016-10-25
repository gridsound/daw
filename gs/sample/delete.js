"use strict";

gs.sample.delete = function( smp ) {
	if ( smp ) {
		var data = smp.data;

		data.oldSelected = !!data.selected; // TODO: #undo
		gs.sample.select( smp, false );
		if ( !--data.gsfile.nbSamples ) {
			ui.CSS_fileUnused( data.gsfile );
		}
		smp.stop();
		data.track.removeSample( smp );
		data.oldTrack = data.track; // TODO: #undo
		smp.data.track = undefined;
		wa.composition.remove( smp );
		ui.CSS_sampleDelete( smp );
	}
};
