"use strict";

( function() {

gs.filePlay = function( gsfile ) {
	if ( smp ) {
		smp.stop();
	}
	if ( gsfile.isLoaded ) {
		wisdom.css( elCursor, "transitionDuration", 0 );
		wisdom.css( elCursor, "left", 0 );
		gsfile.elWaveformWrap.appendChild( elCursor );
		smp = wa.wctx.createSample()
			.setBuffer( gsfile.wbuff )
			.onended( gs.fileStop )
			.load().start();
		setTimeout( function() {
			wisdom.css( elCursor, "transitionDuration", gsfile.wbuff.buffer.duration + "s" );
			wisdom.css( elCursor, "left", "100%" );
		}, 20 );
	}
};

gs.fileStop = function() {
	if ( smp ) {
		smp.stop();
		elCursor.remove();
	}
};

var smp,
	elCursor = wisdom.cE( "<div class='cursor'>" )[ 0 ];

} )();
