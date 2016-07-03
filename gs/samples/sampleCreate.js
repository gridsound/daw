"use strict";

gs.sampleCreate = function( gsfile, trackId, xem ) {
	var sample = new gs.Sample( gsfile, trackId, xem );
	gs.samples.push( sample );
	ui.CSS_fileUsed( gsfile );
	++gsfile.nbSamples;
	return sample;
};
