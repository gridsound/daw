"use strict";

ui.jqPlay.click( function() {
	ui.stopFile();
	gs.playToggle();
} );

ui.jqStop.click( function() {
	ui.stopFile();
	gs.stop();
} );

wa.composition.onended( ui.stop );
