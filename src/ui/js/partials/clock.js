"use strict";

( function() {

var unit;

ui.clockInit = function() {
	ui.dom.clockUnits.onclick = function( e ) {
		var u = e.target.className;

		if ( u === "b" || u === "s" ) {
			setUnit( u );
		}
		return false;
	};
};

ui.clockSetTime = function( sec ) {
	var time = common.timestampText( sec, unit === "s" ? false : waFwk.bpm );

	ui.dom.clockMin.textContent = time.a;
	ui.dom.clockSec.textContent = time.b;
	ui.dom.clockMs.textContent = time.c;
};

ui.clockInBeats = setUnit.bind( null, "b" );
ui.clockInSeconds = setUnit.bind( null, "s" );

function setUnit( u ) {
	ui.dom.clockUnits.dataset.unit = unit = u;
	ui.clockSetTime( gs.currentTime() );
}

} )();
