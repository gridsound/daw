"use strict";

ui.setTrackLinesLeft = function( xpx ) {
	ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
	ui.dom.tracksLines.style.marginLeft = xpx / ui.gridEm + "em";
	ui.updateGridLeftShadow();
};
