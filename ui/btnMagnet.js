"use strict";

ui.isMagnetized = false;

ui.initElement( "btnMagnet", function( el ) {
	function toggle( b ) {
		if ( typeof b !== "boolean" ) {
			b = !ui.isMagnetized;
		}
		ui.isMagnetized = b;
		el.classList.toggle( "active", b );
	}

	return {
		click: toggle,
		toggle: toggle
	};
} );
