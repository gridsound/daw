"use strict";

ui.setClockUnit = function( unit ) {
	ui.dom.clockUnits.dataset.unit = unit;
	ui.currentTime( gs.currentTime() );
};
