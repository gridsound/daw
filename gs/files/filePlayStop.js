"use strict";

( function() {

var wsample,
	elCursor = wisdom.cE( "<div class='cursor'>" )[ 0 ];

gs.filePlay = function( gsfile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( gsfile.isLoaded ) {
		ui.wisdom( elCursor, "transitionDuration", 0 );
		ui.wisdom( elCursor, "left", 0 );
		gsfile.elWaveformWrap.appendChild( elCursor );
		wsample = gsfile.wbuff.createSample().onended( gs.fileStop ).load().start();
		setTimeout( function() {
			ui.wisdom( elCursor, "transitionDuration", gsfile.wbuff.buffer.duration + "s" );
			ui.wisdom( elCursor, "left", "100%" );
		}, 20 );
	}
};

gs.fileStop = function() {
	if ( wsample ) {
		wsample.stop();
		elCursor.remove();
	}
};

} )();
