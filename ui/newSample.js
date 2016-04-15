"use strict";

ui.newSample = function( uifile, trackId, xem ) {
	lg( "newSample" );
	lg( "trackId: " + trackId );
	lg( "xem: " + xem );
	var sample = new ui.Sample( uifile );
};
