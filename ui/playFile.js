"use strict";

(function() {

var
	wsample,
	jqCursor = $( "<div class='cursor'>" )
;

ui.playComposition = function( b, when ) {
	var wsampleArr = [];

	ui.samples.map( function( s ) {
		if ( !b || !when || s.wsample.when + s.wsample.duration > when ) {
			wsampleArr.push( s.wsample );
		}
	});
	if ( b ) {
		wa.wctx.loadSamples( wsampleArr );
		wa.wctx.playSamples( wsampleArr, when );
	} else {
		wa.wctx.stopSamples( wsampleArr );
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
