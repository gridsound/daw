"use strict";

gs.sampleCreate = function( gsfile, trackId, when ) {
	var sample = gs.sample.create( gsfile, trackId, when );
	ui.CSS_fileUsed( gsfile );
	++gsfile.nbSamples;
	return sample;
};
