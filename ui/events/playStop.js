"use strict";

ui.jqStop.click( function() {
	ui.stopFile();
	ui.playComposition( false );
});

ui.jqPlay.click( function() {
	ui.playComposition( true );
});
