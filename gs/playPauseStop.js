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
		ui.play();
	}
};

gs.pause = function() {
	if ( wa.composition.isPlaying ) {
		wa.composition.pause();
		ui.pause();
	}
};

gs.stop = function() {
	if ( wa.composition.isPlaying || wa.composition.isPaused ) {
		wa.composition.stop();
		ui.stop();
	}
};
