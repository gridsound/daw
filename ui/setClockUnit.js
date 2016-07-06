"use strict";

ui.setClockUnit = function( unit ) {
	ui.jqVisualClockUnits.attr( "data-unit", unit );
	ui.currentTime( gs.currentTime() );
};
