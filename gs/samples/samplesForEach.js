"use strict";

gs.samplesForEach = function( smp, fn ) {
	if ( smp ) {
		if ( smp.data.selected ) {
			gs.selectedSamples.forEach( fn );
		} else {
			fn( smp );
		}
	}
};
