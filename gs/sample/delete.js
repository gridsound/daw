"use strict";

gs.sample.delete = function( smp ) {
	if ( smp ) {
		var data = smp.data;

		data.oldSelected = !!data.selected;
		gs.sample.select( smp, false );
		if ( !--data.gsfile.nbSamples ) {
			ui.file.unused( data.gsfile );
		}
		smp.stop();
		data.track.removeSample( smp );
		gs.composition.remove( smp );
		ui.sample.delete( smp );
	}
};
