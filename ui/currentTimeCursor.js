"use strict";

ui.initElement( "currentTimeCursor", function( cursor ) {
	var arrow = ui.dom.currentTimeArrow;

	return {
		at: function( s ) {
			if ( s > 0 ) {
				cursor.style.left =
				arrow.style.left = s * ui.BPMem + "em";
			}
			cursor.classList.toggle( "visible", s > 0 );
			arrow.classList.toggle( "visible", s > 0 );
		}
	};
} );
