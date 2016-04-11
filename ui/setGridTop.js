"use strict";

ui.gridTop = 0;

ui.setGridTop = function( ypx ) {
	if ( ypx >= 0 ) {
		ypx = 0;
	} else {
		var h = ui.tracks.length * ui.em - ui.gridColsHeight;
		if ( ypx < -h ) {
			ypx = -h;
		}
	}
	ui.gridTop = ypx;
	ui.jqGridCols.css( "top", ypx / ui.em + "em" );
};
