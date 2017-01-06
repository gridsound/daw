"use strict";

gs.playStop  = function() { ( gs.isPlaying ? gs.stop : gs.play )(); };
gs.playPause = function() { ( gs.composition.isPlaying ? gs.pause : gs.play )(); };

gs.play = function() {
	gs.file.stop();
	if ( !gs.composition.isPlaying && gs.composition.samples.length ) {
		gs.composition.play();
		if ( gs.composition.isPlaying ) {
			gs.isPaused = !( gs.isPlaying = true );
			ui.btnPlay.play();
		}
	}
};

gs.pause = function() {
	gs.file.stop();
	if ( gs.composition.isPlaying ) {
		gs.composition.pause();
		gs.isPaused = !( gs.isPlaying = false );
		ui.btnPlay.pause();
	}
};

gs.stop = function() {
	gs.file.stop();
	gs.compositionStop();
};

gs.compositionStop = function() {
	gs.composition.stop();
	gs.currentTime( 0 );
	gs.isPaused = gs.isPlaying = false;
	ui.btnStop.stop();
};
