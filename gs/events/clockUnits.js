"use strict";

ui.dom.clockUnits.onclick = function( e ) {
	var unit = e.target.className;

	if ( unit === "s" || unit === "b" ) {
		ui.setClockUnit( gs.clockUnit = unit );
	}
	return false;
};
