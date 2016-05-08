"use strict";

(function() {

var
	wsample,
	jqCursor = $( "<div class='cursor'>" )
;

ui.playComposition = function( compoOffset ) {
	if ( !wa.composition.isPlaying ) {
		wa.composition.loadSamples( compoOffset );
		wa.composition.playSamples( compoOffset );
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

ui.playFile = function( uifile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( uifile.isLoaded ) {
		jqCursor.css( "transitionDuration", 0 ).css( "left", 0 );
		uifile.jqCanvasWaveform.after( jqCursor );
		wsample = uifile.wbuff.createSample().load().start();
		setTimeout( function() {
			jqCursor.css( "transitionDuration", uifile.wbuff.buffer.duration + "s" )
				.css( "left", "100%" );
		}, 20 );
	}
};

ui.stopFile = function() {
	if ( wsample ) {
		wsample.stop();
		jqCursor.detach();
	}
};

})();
