"use strict";

ui.setTimeCursor = function( xem ) {
	if ( xem > 0 ) {
		ui.jqTimeCursor.css( "left", xem + "em" );
	}
	ui.jqTimeCursor[ 0 ].classList.toggle( "visible", xem > 0 );
};
