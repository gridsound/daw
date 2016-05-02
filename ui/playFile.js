"use strict";

(function() {

var
	wsample,
	jqCursor = $( "<div class='cursor'>" ),
	lastSample
;

ui.playComposition = function( fromTime ) {
	if ( wa.composition.wSamples.length && !wa.isPlaying ) {
		lastSample = wa.composition.getLastSample();
		lastSample.onended( function() {
			wa.startedTime = 0;
			wa.pausedOffset = 0;
			wa.isPlaying = false;
		});
		wa.composition.loadSamples( fromTime );
		wa.startedTime = wa.wctx.ctx.currentTime;
		wa.composition.playSamples( fromTime );
		wa.isPlaying = true;
	}
};

ui.stopComposition = function() {
	if ( wa.composition.wSamples.length ) {
		wa.composition.stopSamples();
		wa.startedTime = 0;
		wa.pausedOffset = 0;
		wa.isPlaying = false;
	}
};

ui.pauseComposition = function() {
	if ( wa.composition.wSamples.length && wa.isPlaying ) {
		wa.pausedOffset += wa.wctx.ctx.currentTime - wa.startedTime;
		lastSample = wa.composition.getLastSample();
		lastSample.onended( function() {} );
		wa.composition.stopSamples();
		wa.isPlaying = false;
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
