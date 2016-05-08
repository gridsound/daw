"use strict";

ui.sampleCreate = function( uifile, gridPos ) {
	var sample = new ui.Sample( uifile )
		.inTrack( gridPos.trackId )
		.moveX( gridPos.xem );
	ui.samplesFixPosition( sample );
	ui.samples.push( sample );
	return sample;
};
