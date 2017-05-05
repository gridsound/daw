"use strict";

ui.tracksBg = {
	init: function() {
		ui.tracksBg._elLines = document.querySelector( ".gsuiBeatLines" );
		ui.tracksBg._uiLines = new gsuiBeatLines( ui.tracksBg._elLines );
	},
	update: function() {
		var w = ui.trackLinesWidth,
			lines = ui.tracksBg._uiLines;

		if ( w > 0 ) {
			ui.tracksBg._elLines.style.width = w + "px";
			lines.offset = ui.trackLinesLeft / -ui.gridEm;
			lines.setResolution( w );
			lines.draw();
		}
	}
};
