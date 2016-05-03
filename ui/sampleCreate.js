"use strict";

ui.sampleCreate = function( uifile, trackId, xem ) {
	var sample = new ui.Sample( uifile )
		.inTrack( trackId )
		.moveX( xem )
		.updateWidth();
	ui.samplesFixPosition( sample );
	ui.samples.push( sample );
	return sample;
};
