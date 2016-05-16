"use strict";

gs.currentTime = function( sec ) {
	if ( !arguments.length ) {
		return wa.composition.currentTime();
	}
	wa.composition.currentTime( sec );
	ui.currentTime( wa.composition.currentTime() );
};
