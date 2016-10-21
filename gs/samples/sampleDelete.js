"use strict";

gs.sampleDelete = function( smp ) {
	if ( smp ) {
		smp.data.oldSelected = !!smp.data.selected; // TODO: #undo
		gs.sampleSelect( smp, false );
		if ( !--smp.data.gsfile.nbSamples ) {
			ui.CSS_fileUnused( smp.data.gsfile );
		}
		gs.sample.delete( smp );
	}
};
