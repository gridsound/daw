"use strict";

ui.jqPlay.click( ui.playComposition );

ui.jqStop.click( function() {
	ui.stopFile();
	ui.stopComposition();
});
