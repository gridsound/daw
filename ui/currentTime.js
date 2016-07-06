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
	ui.jqClockMin.text( ~~( s / 60 ) );
	var sc = ~~( s % 60 );
	ui.jqClockSec.text( sc < 10 ? "0" + sc : sc );
	s = Math.floor( ( s - ~~s ) * 1000 );
	if ( s < 10 ) {
		s = "00" + s;
	} else if ( s < 100 ) {
		s = "0" + s;
	}
	ui.jqClockMs.text( s );
}

ui.currentTime = function( s ) {
	cursorTime( s );
	clockTime( gs.clockUnit === "s" ? s : s * ui.BPMem );
};

} )();
