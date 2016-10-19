"use strict";

gs.playStop  = function() { ( gs.isPlaying ? gs.stop : gs.play )(); };
gs.playPause = function() { ( wa.composition.isPlaying ? gs.pause : gs.play )(); };

gs.play = function() {
	gs.fileStop();
	if ( !wa.composition.isPlaying && wa.composition.wSamples.length && gs.samples.length ) {
		wa.composition.play();
		if ( wa.composition.isPlaying ) {
			gs.isPaused = !( gs.isPlaying = true );
			ui.btnPlay.play();
		}
	}
};

gs.pause = function() {
	gs.fileStop();
	if ( wa.composition.isPlaying ) {
		wa.composition.pause();
		gs.isPaused = !( gs.isPlaying = false );
		ui.btnPlay.pause();
	}
};

gs.stop = function() {
	gs.fileStop();
	gs.compositionStop();
};

gs.compositionStop = function() {
	wa.composition.stop();
	gs.currentTime( 0 );
	gs.isPaused = gs.isPlaying = false;
	ui.btnStop.stop();
};
