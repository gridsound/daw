"use strict";

( function() {

function cursorTime( s ) {
	if ( s > 0 ) {
		var v = s * ui.BPMem + "em";
		ui.css( ui.elTimeCursor, "left", v );
		ui.css( ui.elTimeArrow, "left", v );
	}
	ui.elTimeCursor.classList.toggle( "visible", s > 0 );
	ui.elTimeArrow.classList.toggle( "visible", s > 0 );
}

function clockTime( s ) {
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
	ui.elClockMin.textContent = a;
	ui.elClockSec.textContent = b;
	ui.elClockMs.textContent = bb;
}

ui.currentTime = function( s ) {
	cursorTime( s );
	clockTime( s );
};

} )();
