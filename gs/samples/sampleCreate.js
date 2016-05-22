"use strict";

gs.sampleCreate = function( uifile, trackId, xem ) {
	var sample = new gs.Sample( uifile );
	sample.inTrack( trackId );
	sample.moveX( xem );
	gs.samples.push( sample );
	wa.composition.addSamples( [ sample.wsample ] );
	return sample;
};
