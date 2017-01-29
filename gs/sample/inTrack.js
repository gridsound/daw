"use strict";

gs.sample.inTrack = function( smp, trackId ) {
	var smpData = smp.data,
		trkUsrData = waFwk.tracks[ trackId ].userData;

	smp.disconnect();
	smp.connect( trkUsrData.wfilters );
	if ( smpData.track ) {
		smpData.track.removeSample( smp );
	}
	smpData.track = trkUsrData;
	trkUsrData.samples.push( smp );
	ui.sample.inTrack( smp );
};
