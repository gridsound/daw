"use strict";

gs.file.play = function( that ) {
	var cursor, smp = gs.file.playingSmp;

	if ( smp ) {
		smp.stop();
	}
	if ( that.isLoaded ) {
		cursor = gs.file.cursor = gs.file.cursor || wisdom.cE( "<div class='cursor'>" )[ 0 ];
		cursor.style.transitionDuration =
		cursor.style.left = 0;
		that.elWaveformWrap.appendChild( cursor );
		gs.file.playingSmp = wa.wctx.createSample().setBuffer( that.wbuff )
			.onended( gs.file.stop ).load().start();
		setTimeout( function() {
			cursor.style.transitionDuration = that.wbuff.buffer.duration + "s";
			cursor.style.left = "100%";
		}, 20 );
	}
};
