"use strict";

gs.samplesDelete = function( smp ) {
	if ( smp ) {
		if ( smp.data ) {
			gs.sampleDelete( smp );
		} else {
			gs.selectedSamples.slice( 0 ).forEach( gs.sampleDelete );
			gs.selectedSamples = [];
		}
	}
};
