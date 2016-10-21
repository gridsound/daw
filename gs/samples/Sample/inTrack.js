"use strict";

gs.sample.inTrack = function( smp, trackId ) {
	var track = ui.tracks[ trackId ];

	if ( track !== smp.track ) {
		if ( smp.wsample ) { // TODO: #emptySample
			smp.wsample.disconnect();
			smp.wsample.connect( track.wfilters );
		}
		if ( smp.track ) {
			smp.track.removeSample( smp );
		}
		smp.track = track;
		smp.track.samples.push( smp );
		ui.CSS_sampleTrack( smp );
	}
};
