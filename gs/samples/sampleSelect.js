"use strict";

gs.sampleSelect = function( smp, b ) {
	if ( smp && smp.data.selected !== b ) {
		gs.sample.select( smp, b );
		if ( b ) {
			gs.selectedSamples.push( smp );
		} else {
			gs.selectedSamples.splice( gs.selectedSamples.indexOf( smp ), 1 );
		}
	}
};
