"use strict";

gs.bpm = function( bpm ) {
	if ( !arguments.length ) {
		return gs._bpm;
	}
	var xem = gs.currentTime() * ui.BPMem;
	gs._bpm = Math.max( 20, Math.min( bpm, 999 ) );
	ui.bpm( gs._bpm );
	gs.samples.forEach( function( s ) {
		// We don't have to call .CSS_sampleWhen, the samples doesn't move when the BPM changes.
		if ( s.wsample ) {
			s.wsample.when = s.xem / ui.BPMem;
			ui.CSS_sampleDuration( s );
			ui.CSS_sampleOffset( s );
		} else {
			s.savedWhen = s.xem / ui.BPMem;
			ui.css( s.elSample, "width", s.savedDuration * ui.BPMem + "em" );
		}
	});
	gs.currentTime( xem / ui.BPMem );
};
