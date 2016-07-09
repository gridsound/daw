"use strict";

ui.jqVisualClockUnits.click( function( e ) {
	var unit = e.target.className;
	if ( unit === "s" || unit === "b" ) {
		ui.setClockUnit( gs.clockUnit = unit );
	}
	return false;
} );
