"use strict";

ui.newSample = function( uifile, trackId, xem ) {
	ui.samples.push( new ui.Sample( uifile )
		.inTrack( trackId )
		.moveX( xem )
		.updateWidth()
	);
};
