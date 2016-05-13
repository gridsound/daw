"use strict";

gs.currentTime = function( sec ) {
	if ( !arguments.length ) {
		return;
		// return wa.composition.currentTime();
	}
	ui.currentTime( sec );
	// wa.composition.currentTime( sec );
};
