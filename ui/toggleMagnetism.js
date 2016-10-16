"use strict";

ui.isMagnetized = false;

ui.toggleMagnetism = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !ui.isMagnetized;
	}
	ui.isMagnetized = b;
	ui.dom.btnMagnet.classList.toggle( "active", b );
};
