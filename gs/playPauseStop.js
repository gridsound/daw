"use strict";

gs.playToggle = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !gs.isPlaying;
	}
	b ? gs.play() : gs.pause();
};

gs.play = function() {
	if ( !gs.isPlaying && ui.samples.length ) {
		gs.isPaused = gs.isStopped = false;
		gs.isPlaying = true;
		wa.composition.playFrom();
		wa.compositionLoop( true );
		ui.play();
	}
};

gs.pause = function() {
	if ( gs.isPlaying ) {
		gs.isPlaying = false;
		gs.isPaused = true;
		wa.composition.pause();
		wa.compositionLoop( false );
		ui.pause();
	}
};

gs.stop = function() {
	if ( !gs.isStopped ) {
		gs.isPlaying = gs.isPaused = false;
		gs.isStopped = true;
		wa.composition.stop();
		wa.compositionLoop( false );
		ui.stop();
	}
};
