"use strict";

ui.gridcontent = {
	init: function() {
	},
	left: function( xpx ) {
		ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
		ui.dom.gridcontent.style.marginLeft = xpx / ui.gridEm + "em";
		ui.updateGridLeftShadow();
	}
};
