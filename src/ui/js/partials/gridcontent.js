"use strict";

ui.gridcontentInit = function() {
};

ui.gridcontentLeft = function( xpx ) {
	ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
	ui.dom.gridcontent.style.marginLeft = xpx / ui.gridEm + "em";
	ui.updateGridLeftShadow();
};
