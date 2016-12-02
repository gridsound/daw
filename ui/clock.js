"use strict";

ui.initElement( "clock", function( el ) {
	return {
		setUnit: function( unit ) {
			ui.dom.clockUnits.dataset.unit = unit;
			ui.clock.setTime( gs.currentTime() );
		},
		setTime: function( sec ) {
			var time = ui.timestampText( sec, gs.clockUnit === "s" ? false : gs._bpm );

			ui.dom.clockMin.textContent = time.a;
			ui.dom.clockSec.textContent = time.b;
			ui.dom.clockMs.textContent = time.c;
		}
	};
} );
