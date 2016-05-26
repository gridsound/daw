"use strict";

gs.samplesDelete = function() {
	gs.selectedSamples.slice( 0 ).forEach( gs.sampleDelete );
	gs.selectedSamples = [];
};
