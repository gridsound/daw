"use strict";

gs.playToggle = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !wa.composition.isPlaying;
	}
	b ? gs.play() : gs.pause();
};

gs.play = function() {
	if ( !wa.composition.isPlaying && ui.samples.length ) {
		wa.composition.play();
		if ( wa.composition.isPlaying ) {
			ui.play();
		}
	}
};

gs.pause = function() {
	if ( wa.composition.isPlaying ) {
		wa.composition.pause();
		ui.pause();
	}
};

gs.stop = function() {
	wa.composition.stop();
	gs.currentTime( 0 );
	ui.stop();
};
