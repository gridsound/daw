"use strict";

ui.setClockUnit = function( unit ) {
	ui.elClockUnits.dataset.unit = unit;
	ui.currentTime( gs.currentTime() );
};
