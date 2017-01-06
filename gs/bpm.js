"use strict";

ui.BPMem = 1;

gs.bpm = function( bpm ) {
	if ( !arguments.length ) {
		return gs._bpm;
	}
	gs.composition.bpm( Math.max( 20, Math.min( bpm, 999 ) ) );
	gs._bpm = gs.composition.bpm();
	ui.bpm.set( gs._bpm );
	ui.BPMem = gs._bpm / 60;
	gs.composition.samples.forEach( ui.sample.duration );
	ui.clock.setTime( gs.currentTime() );
};
