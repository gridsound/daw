"use strict";

(function() {

var
	wsample,
	jqCursor = $( "<div class='cursor'>" )
;

ui.playComposition = function() {
	var wsampleArr = [];

	$.each( ui.samples, function() {
		wsampleArr.push( this.wsample );
	});

	wa.wctx.loadSamples( wsampleArr );
	wa.wctx.playSamples( wsampleArr );
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
	var wsampleArr = [];
	
	if ( wsample ) {
		wsample.stop();
		jqCursor.detach();
	}

	$.each( ui.samples, function() {
		wsampleArr.push( this.wsample );
	});
	wa.wctx.stopSamples( wsampleArr );
};

})();
