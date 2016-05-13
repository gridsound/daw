"use strict";

ui.jqPlay.click( gs.playToggle );

ui.jqStop.click( function() {
	ui.stopFile();
	gs.stop();
});
