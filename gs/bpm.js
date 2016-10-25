"use strict";

ui.BPMem = 1;

gs.bpm = function( bpm, delay ) {
	if ( !arguments.length ) {
		return gs._bpm;
	}
	var BPMdiff,
		oldBPMem = ui.BPMem,
		oldTimeEm = gs.currentTime() * oldBPMem;

	gs._bpm = Math.max( 20, Math.min( bpm, 999 ) );
	ui.bpm( gs._bpm );
	ui.BPMem = bpm / 60;
	BPMdiff = oldBPMem / ui.BPMem;
	wa.composition.samples.forEach( function( smp ) {
		smp.when = smp.when * BPMdiff;
		ui.sample.duration( smp );
	} );
	gs.currentTime( oldTimeEm / ui.BPMem );
};
