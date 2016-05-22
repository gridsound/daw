"use strict";

gs.samplesUnselect = function() {
	gs.selectedSamples.forEach( function( sample ) {
		sample.select( false );
	});
	gs.selectedSamples = [];
};
