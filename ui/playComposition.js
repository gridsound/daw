"use strict";

ui.playComposition = function() {
	if ( !wa.composition.isPlaying ) {
		var sec = wa.composition.pausedOffset;
		wa.composition.loadSamples( sec );
		wa.composition.playSamples( sec );
	}
};

ui.stopComposition = function() {
	wa.composition.stopSamples();
};

ui.pauseComposition = function() {
	if ( wa.composition.isPlaying ) {
		wa.composition.pauseSamples();
	}
};
