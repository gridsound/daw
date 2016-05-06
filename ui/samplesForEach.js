"use strict";

ui.samplesForEach = function( sample, fn ) {
	if ( sample ) {
		if ( sample.selected ) {
			ui.selectedSamples.forEach( fn );
		} else {
			fn( sample );
		}
	}
};
