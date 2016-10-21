"use strict";

gs.samplesUnselect = function() {
	gs.selectedSamples.forEach( function( smp ) {
		gs.sample.select( smp, false );
	} );
	gs.selectedSamples = [];
};
