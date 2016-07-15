"use strict";

ui.setTrackLinesLeft = function( xpx ) {
	ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
	ui.css( ui.jqTrackLines[ 0 ], "marginLeft", xpx / ui.gridEm + "em" );
	ui.updateGridLeftShadow();
};
