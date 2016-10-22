"use strict";

gs.samplesUnselect = function() {
	gs.selectedSamples.forEach( function( smp ) {
		smp.data.selected = false;
		ui.sample.select( smp );
	} );
	gs.selectedSamples = [];
};
