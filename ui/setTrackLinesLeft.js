"use strict";

ui.setTrackLinesLeft = function( xpx ) {
	ui.trackLinesLeft = xpx = Math.min( ~~xpx, 0 );
	wisdom.css( ui.dom.tracksLines, "marginLeft", xpx / ui.gridEm + "em" );
	ui.updateGridLeftShadow();
};
