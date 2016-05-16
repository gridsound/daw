"use strict";

(function() {

var wsample,
	jqCursor = $( "<div class='cursor'>" );

ui.playFile = function( uifile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( uifile.isLoaded ) {
		uifile.jqCanvasWaveform.after(
			jqCursor.css( "transitionDuration", 0 ).css( "left", 0 )
		);
		wsample = uifile.wbuff.createSample().onended( ui.stopFile ).load().start();
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
