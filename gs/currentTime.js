"use strict";

gs.currentTime = function( sec ) {
	if ( !arguments.length ) {
		return wa.composition.currentTime();
	}
	wa.composition.currentTime( sec );
	sec = wa.composition.currentTime();
	ui.currentTimeCursor.at( sec );
	ui.clock.setTime( sec );
};
