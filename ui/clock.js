"use strict";

ui.initElement( "clock", function( el ) {
	return {
		setUnit: function( unit ) {
			var sec = gs.currentTime();

			ui.dom.clockUnits.dataset.unit = unit;
			ui.currentTimeCursor.at( sec );
			ui.clock.setTime( sec );
		},
		setTime: function( s ) {
			//  0: 0. 00
			var a, b, bb;

			if ( gs.clockUnit === "s" ) {
				a = ~~( s / 60 );
				b = ~~( s % 60 );
			} else {
				s *= ui.BPMem;
				a = 1 + ~~s;
				s *= 4;
				b = 1 + ~~s % 4;
			}
			b = b < 10 ? "0" + b : b;
			bb = Math.floor( ( s - ~~s ) * 1000 );
			if ( bb < 10 ) {
				bb = "00" + bb;
			} else if ( bb < 100 ) {
				bb = "0" + bb;
			}
			ui.dom.clockMin.textContent = a;
			ui.dom.clockSec.textContent = b;
			ui.dom.clockMs.textContent = bb;
		}
	};
} );
