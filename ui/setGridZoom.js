"use strict";

ui.gridZoom = 1;

ui.setGridZoom = function( zm, xpx, ypx ) {
	zm = Math.min( Math.max( 1, zm ), 8 );
	var zmMul = zm / ui.gridZoom;
	ui.gridZoom = zm;
	ui.em *= zmMul;
	ui.jqGridEm.css( "fontSize", zm + "em" );
	ui.setGridTop( ypx - ( -ui.gridTop + ypx ) * zmMul );
	ui.setTrackLinesLeft( xpx - ( -ui.trackLinesLeft + xpx ) * zmMul );
	ui.updateTimeline();
};
