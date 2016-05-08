"use strict";

ui.setCursorTime = function( sec ) {
	if ( sec > 0 ) {
		ui.jqTimeCursor.css( "left", sec * ui.BPMem + "em" );
	}
	ui.jqTimeCursor[ 0 ].classList.toggle( "visible", sec > 0 );
};
