"use strict";

gs.file.play = function( that ) {
	var smp = gs.file.playingSmp;

	if ( smp ) {
		smp.stop();
	}
	if ( that.isLoaded ) {
		ui.filesCursor.insertInto( that );
		gs.file.playingSmp = wa.wctx.createSample().setBuffer( that.wbuff )
			.onended( gs.file.stop ).load().start();
		setTimeout( ui.filesCursor.startMoving.bind( null, that.wbuff.buffer.duration ), 20 );
	}
};
