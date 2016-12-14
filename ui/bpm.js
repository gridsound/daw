"use strict";

ui.initElement( "bpm", function( el ) {
	var timeoutId;

	function wheel( inc, e ) {
		var dy = e.deltaY;

		e.preventDefault();
		ui.bpm.set( ui._bpm + ( dy > 0 ? -inc : dy ? inc : 0 ) );
		clearTimeout( timeoutId );
		timeoutId = setTimeout( gs.bpm.bind( null, ui._bpm ), 400 );
	}

	ui.dom.bpmInt.onwheel = wheel.bind( null, 1 );
	ui.dom.bpmDec.onwheel = wheel.bind( null, .01 );

	ui.dom.bpm.ondblclick = function() {
		var bpm = +prompt( "BPM (20-999) :" );

		bpm && gs.bpm( bpm );
	};

	return {
		set: function( bpm ) {
			var bInt = ~~bpm,
				bCent = Math.min( Math.round( ( bpm - bInt ) * 100 ), 99 );

			ui._bpm = bpm;
			ui.dom.bpmInt.textContent = bInt < 100 ? "0" + bInt : bInt;
			ui.dom.bpmDec.textContent = bCent < 10 ? "0" + bCent : bCent;
		}
	};
} );
