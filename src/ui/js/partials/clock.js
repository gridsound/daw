"use strict";

ui.clock = {
	init: function() {
		ui.dom.clockUnits.onclick = function( e ) {
			var u = e.target.className;

			if ( u === "b" || u === "s" ) {
				ui.clock._setUnit( u );
			}
			return false;
		};
	},
	currentTime: function( sec ) {
		var time = common.timestampText( sec,
				ui.clock._unit === "s" ? false : waFwk.bpm );

		ui.dom.clockMin.textContent = time.a;
		ui.dom.clockSec.textContent = time.b;
		ui.dom.clockMs.textContent = time.c;
	},

	// private:
	_setUnit: function( u ) {
		ui.dom.clockUnits.dataset.unit =
			ui.clock._unit = u;
		ui.clock.currentTime( gs.currentTime() );
	}
};

ui.clock.inBeats = ui.clock._setUnit.bind( null, "b" );
ui.clock.inSeconds = ui.clock._setUnit.bind( null, "s" );
