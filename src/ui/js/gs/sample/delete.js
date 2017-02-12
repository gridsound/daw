"use strict";

gs.sample.delete = function( smp ) {
	if ( smp ) {
		var data = smp.data;

		data.oldSelected = !!data.selected;
		gs.sample.select( smp, false );
		if ( !--data.gsfile.nbSamples ) {
			data.gsfile.source.unused();
		}
		smp.stop();
		data.track.removeSample( smp );
		gs.composition.remove( smp );
		ui.sample.delete( smp );
	}
};
