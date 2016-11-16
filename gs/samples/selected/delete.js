"use strict";

gs.samples.selected.delete = function() {
	if ( gs.selectedSamples.length ) {
		var smps = gs.selectedSamples.slice();

		smps.forEach( gs.sample.delete );
		gs.history.push( "delete", { samples: smps } );
		gs.selectedSamples.length = 0;
	}
};
