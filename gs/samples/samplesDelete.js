"use strict";

gs.samplesDelete = function( sample ) {
	if ( sample ) {
		gs.sampleDelete( sample );
	} else {
		gs.selectedSamples.slice( 0 ).forEach( gs.sampleDelete );
		gs.selectedSamples = [];
	}
};
