"use strict";

ui.jqPlay.click( function() {
	gs.fileStop();
	gs.playToggle();
} );

ui.jqStop.click( function() {
	gs.fileStop();
	gs.stop();
} );

wa.composition.onended( ui.stop );
