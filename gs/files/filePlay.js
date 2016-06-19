"use strict";

( function() {

var wsample,
	jqCursor = $( "<div class='cursor'>" );

gs.filePlay = function( gsfile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( gsfile.isLoaded ) {
		gsfile.jqCanvasWaveform.after(
			jqCursor.css( "transitionDuration", 0 ).css( "left", 0 )
		);
		wsample = gsfile.wbuff.createSample().onended( gs.fileStop ).load().start();
		setTimeout( function() {
			jqCursor.css( "transitionDuration", gsfile.wbuff.buffer.duration + "s" )
				.css( "left", "100%" );
		}, 20 );
	}
};

gs.fileStop = function() {
	if ( wsample ) {
		wsample.stop();
		jqCursor.detach();
	}
};

} )();
