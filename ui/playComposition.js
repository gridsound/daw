"use strict";

ui.playComposition = function() {
	if ( !wa.composition.isPlaying ) {
		var sec = wa.composition.pausedOffset;
		wa.composition.loadSamples( sec );
		wa.composition.playSamples( sec );
		wa.compositionLoop( true );
	}
};

ui.stopComposition = function() {
	wa.composition.stopSamples();
	wa.compositionLoop( false );
};

ui.pauseComposition = function() {
	if ( wa.composition.isPlaying ) {
		wa.composition.pauseSamples();
		wa.compositionLoop( false );
	}
};
