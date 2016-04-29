"use strict";

ui.jqStop.click( function() {
	ui.stopFile();
	ui.playComposition( false );
});

ui.jqPlay.click( ui.playComposition.bind( null, true ) );
