"use strict";

( function() {

function cursorTime( s ) {
	var val,
		cu = ui.jqTimeCursor[ 0 ],
		ar = ui.jqTimeArrow[ 0 ];
	if ( s > 0 ) {
		val = s * ui.BPMem + "em";
		ui.css( cu, "left", val );
		ui.css( ar, "left", val );
	}
	cu.classList.toggle( "visible", s > 0 );
	ar.classList.toggle( "visible", s > 0 );
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
	ui.jqClockMin[ 0 ].textContent = a;
	ui.jqClockSec[ 0 ].textContent = b;
	ui.jqClockMs[ 0 ].textContent = bb;
}

ui.currentTime = function( s ) {
	cursorTime( s );
	clockTime( s );
};

} )();
