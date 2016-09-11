"use strict";

gs.bpm = function( bpm ) {
	if ( !arguments.length ) {
		return gs._bpm;
	}
	var BPMdiff,
		oldBPMem = ui.BPMem,
		oldTimeEm = gs.currentTime() * oldBPMem;

	gs._bpm = Math.max( 20, Math.min( bpm, 999 ) );
	ui.bpm( gs._bpm );
	BPMdiff = oldBPMem / ui.BPMem;
	gs.samples.forEach( function( s ) {
		// We don't have to call .CSS_sampleWhen, the samples doesn't move when the BPM changes.
		if ( s.wsample ) {
			s.wsample.when = s.wsample.when * BPMdiff;
			ui.CSS_sampleDuration( s );
			ui.CSS_sampleOffset( s );
		} else {
			s.savedWhen = s.savedWhen * BPMdiff;
			wisdom.css( s.elSample, "width", s.savedDuration * ui.BPMem + "em" );
		}
	} );
	gs.currentTime( oldTimeEm / ui.BPMem );
};
