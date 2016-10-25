"use strict";

( function() {

gs.file.play = function( that ) {
	if ( smp ) {
		smp.stop();
	}
	if ( that.isLoaded ) {
		wisdom.css( elCursor, "transitionDuration", 0 );
		wisdom.css( elCursor, "left", 0 );
		that.elWaveformWrap.appendChild( elCursor );
		smp = wa.wctx.createSample()
			.setBuffer( that.wbuff )
			.onended( gs.file.stop )
			.load().start();
		setTimeout( function() {
			wisdom.css( elCursor, "transitionDuration", that.wbuff.buffer.duration + "s" );
			wisdom.css( elCursor, "left", "100%" );
		}, 20 );
	}
};

gs.file.stop = function() {
	if ( smp ) {
		smp.stop();
		elCursor.remove();
	}
};

var smp,
	elCursor = wisdom.cE( "<div class='cursor'>" )[ 0 ];

} )();
