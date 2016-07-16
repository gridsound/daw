"use strict";

( function() {

var wsample,
	jqCursor = $( "<div class='cursor'>" );

gs.filePlay = function( gsfile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( gsfile.isLoaded ) {
		ui.css( jqCursor[ 0 ], "transitionDuration", 0 );
		ui.css( jqCursor[ 0 ], "left", 0 );
		gsfile.elWaveformWrap.appendChild( jqCursor[ 0 ] );
		wsample = gsfile.wbuff.createSample().onended( gs.fileStop ).load().start();
		setTimeout( function() {
			ui.css( jqCursor[ 0 ], "transitionDuration", gsfile.wbuff.buffer.duration + "s" );
			ui.css( jqCursor[ 0 ], "left", "100%" );
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
