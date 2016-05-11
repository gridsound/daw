"use strict";

(function() {

function setClockTime( s ) {
	ui.clockTime = s;
	ui.jqClockMin.text( ~~( s / 60 ) );
	var sc = ~~( s % 60 );
	ui.jqClockSec.text( sc < 10 ? "0" + sc : sc );
	s = Math.round( ( s - ~~s ) * 1000 );
	if ( s < 10 ) {
		s = "00" + s;
	} else if ( s < 100 ) {
		s = "0" + s;
	}
	ui.jqClockMs.text( s );
}

function setCursorTime( s ) {
	if ( s > 0 ) {
		ui.jqTimeCursor.css( "left", s * ui.BPMem + "em" );
	}
	ui.jqTimeCursor[ 0 ].classList.toggle( "visible", s > 0 );
}

ui.setCurrentTime = function( s ) {
	setClockTime( s );
	setCursorTime( s );
};

})();
