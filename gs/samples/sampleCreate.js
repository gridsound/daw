"use strict";

gs.sampleCreate = function( uifile, trackId, xem ) {
	var sample = new gs.Sample( uifile );
	if ( uifile.file ) {
		sample.inTrack( trackId );
		sample.moveX( xem );
		wa.composition.addSamples( [ sample.wsample ] );
	}
	gs.samples.push( sample );
	return sample;
};
