"use strict";

gs.samples.selected.delete = function( smp ) {
	if ( smp ) {
		if ( smp.data ) {
			gs.sample.delete( smp );
		} else {
			gs.selectedSamples.slice( 0 ).forEach( gs.sample.delete );
			gs.selectedSamples = [];
		}
	}
};
