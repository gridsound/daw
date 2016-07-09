"use strict";

gs.playToggle = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !wa.composition.isPlaying;
	}
	b ? gs.play() : gs.pause();
};

gs.play = function() {
	if ( !wa.composition.isPlaying && wa.composition.wSamples.length && gs.samples.length ) {
		wa.composition.play();
		if ( wa.composition.isPlaying ) {
			gs.isPaused = !( gs.isPlaying = true );
			ui.play();
		}
	}
};

gs.pause = function() {
	if ( wa.composition.isPlaying ) {
		wa.composition.pause();
		gs.isPaused = !( gs.isPlaying = false );
		ui.pause();
	}
};

gs.stop = function() {
	wa.composition.stop();
	gs.currentTime( 0 );
	gs.isPaused = gs.isPlaying = false;
	ui.stop();
};
