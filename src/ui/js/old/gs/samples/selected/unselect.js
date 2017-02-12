"use strict";

gs.samples.selected.unselect = function() {
	gs.selectedSamples.forEach( function( smp ) {
		smp.data.selected = false;
		ui.sample.select( smp );
	} );
	gs.selectedSamples.length = 0;
};
