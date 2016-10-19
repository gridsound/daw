"use strict";

( function() {

ui.currentTime = function( s ) {
	timeCursor( s );
	ui.clock.setTime( s );
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

} )();
