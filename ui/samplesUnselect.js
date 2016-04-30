"use strict";

ui.samplesUnselect = function() {
	ui.selectedSamples.forEach( function( sample ) {
		sample.select( false );
	});
	ui.selectedSamples = [];
};
