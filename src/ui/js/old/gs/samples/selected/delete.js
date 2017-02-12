"use strict";

gs.samples.selected.delete = function() {
	if ( gs.selectedSamples.length ) {
		gs.history.pushExec( "delete", {
			samples: gs.selectedSamples.slice()
		} );
		gs.selectedSamples.length = 0;
	}
};
