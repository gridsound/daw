"use strict";

( function() {

function cursorTime( s ) {
	if ( s > 0 ) {
		ui.jqTimeCursor.add( ui.jqTimeArrow )
			.css( "left", s * ui.BPMem + "em" );
	}
	ui.jqTimeCursor[ 0 ].classList.toggle( "visible", s > 0 );
	ui.jqTimeArrow[ 0 ].classList.toggle( "visible", s > 0 );
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
	ui.jqClockMin.text( a );
	ui.jqClockSec.text( b );
	ui.jqClockMs.text( bb );
}

ui.currentTime = function( s ) {
	cursorTime( s );
	clockTime( s );
};

} )();
