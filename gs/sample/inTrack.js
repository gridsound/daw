"use strict";

gs.sample.inTrack = function( smp, trackId ) {
	var smpData = smp.data,
		track = ui.tracks[ trackId ];

	if ( track !== smpData.track ) {
		smp.disconnect();
		smp.connect( track.wfilters );
		if ( smpData.track ) {
			smpData.track.removeSample( smp );
		}
		smpData.track = track;
		track.samples.push( smp );
		ui.sample.inTrack( smp );
	}
};
