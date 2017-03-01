"use strict";

gs.currentTime = function( sec ) {
	if ( !arguments.length ) {
		return gs.composition.currentTime();
	}
	gs.composition.currentTime( sec );
	sec = gs.composition.currentTime();
	ui.timeline.currentTime( sec );
	ui.clock.currentTime( sec );
};
