"use strict";

ui.newSample = function( uifile, trackId, xem ) {
	var sample = new ui.Sample( uifile )
		.inTrack( trackId ).moveX( xem );
	sample.setWidth( sample.wbuff.buffer.duration );
};
