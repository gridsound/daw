"use strict";

( function() {

ui.currentTime = function( s ) {
	timeCursor( s );
	timeClock( s );
};

function timeCursor( s ) {
	if ( s > 0 ) {
		var v = s * ui.BPMem + "em";

		wisdom.css( ui.dom.currentTimeCursor, "left", v );
		wisdom.css( ui.dom.currentTimeArrow, "left", v );
	}
	ui.dom.currentTimeCursor.classList.toggle( "visible", s > 0 );
	ui.dom.currentTimeArrow.classList.toggle( "visible", s > 0 );
}

function timeClock( s ) {
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

} )();
