"use strict";

ui.setTrackLinesLeft = function( xpx ) {
	ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
	ui.jqTrackLines.css( "marginLeft", xpx / ui.gridEm + "em" );
	ui.updateGridLeftShadow();
};
