"use strict";

ui.newSample = function( uifile, trackId, xem ) {
	var sample = new ui.Sample( uifile )
		.inTrack( trackId )
		.moveX( xem )
		.updateWidth();
	ui.samples.push( sample );
	return sample;
};
