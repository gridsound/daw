"use strict";

gs.samplesForEach = function( sample, fn ) {
	if ( sample ) {
		if ( sample.selected ) {
			gs.selectedSamples.forEach( fn );
		} else {
			fn( sample );
		}
	}
};
