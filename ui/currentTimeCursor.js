"use strict";

ui.initElement( "currentTimeCursor", function( cursor ) {
	var arrow = ui.dom.currentTimeArrow;

	return {
		at: function( s ) {
			if ( s > 0 ) {
				var v = s * ui.BPMem + "em";

				wisdom.css( cursor, "left", v );
				wisdom.css( arrow, "left", v );
			}
			cursor.classList.toggle( "visible", s > 0 );
			arrow.classList.toggle( "visible", s > 0 );
		}
	};
} );
