"use strict";

gs.file.stop = function() {
	var smp = gs.file.playingSmp;

	if ( smp ) {
		smp.stop();
		gs.file.cursor.remove();
	}
};
