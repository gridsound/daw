"use strict";

gs.file.play = function( that ) {
	var smp = gs.file.playingSmp;

	if ( smp ) {
		smp.stop();
	}
	if ( that.isLoaded ) {
		ui.filesCursor.insertInto( that.source );
		gs.file.playingSmp = that.wbuff.sample.start();
		setTimeout( ui.filesCursor.startMoving.bind( null, that.wbuff.buffer.duration ), 20 );
	}
};
