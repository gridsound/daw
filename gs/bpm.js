"use strict";

ui.BPMem = 1;

gs.bpm = function( bpm ) {
	if ( !arguments.length ) {
		return gs._bpm;
	}
	wa.composition.bpm( Math.max( 20, Math.min( bpm, 999 ) ) );
	gs._bpm = wa.composition.bpm();
	ui.bpm( gs._bpm );
	ui.BPMem = gs._bpm / 60;
	wa.composition.samples.forEach( ui.sample.duration );
	ui.clock.setTime( gs.currentTime() );
};
