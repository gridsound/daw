"use strict";

ui.sampleCreate = function( uifile, trackId, xem ) {
	var sample = new ui.Sample( uifile )
		.inTrack( trackId )
		.moveX( xem );
	ui.samplesFixPosition( sample );
	ui.samples.push( sample );
	wa.composition.addSamples( [ sample.wsample ] );
	return sample;
};
