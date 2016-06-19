"use strict";

gs.sampleCreate = function( gsfile, trackId, xem ) {
	var sample = new gs.Sample( gsfile );
	if ( gsfile.file ) {
		sample.inTrack( trackId );
		sample.moveX( xem );
		wa.composition.addSamples( [ sample.wsample ] );
	}
	gs.samples.push( sample );
	return sample;
};
