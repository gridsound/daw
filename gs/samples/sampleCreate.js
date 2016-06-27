"use strict";

gs.sampleCreate = function( gsfile, trackId, xem ) {
	var sample = new gs.Sample( gsfile, trackId, xem );
	gs.samples.push( sample );
	return sample;
};
