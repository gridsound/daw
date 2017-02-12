"use strict";

gs.currentTime = function( sec ) {
	if ( !arguments.length ) {
		return gs.composition.currentTime();
	}
	gs.composition.currentTime( sec );
	sec = gs.composition.currentTime();
	ui.currentTimeCursor.at( sec );
	ui.clock.setTime( sec );
};
