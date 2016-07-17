"use strict";

ui.gridScrollTop = 0;

ui.setGridScrollTop = function( ypx ) {
	ui.elGridCols.scrollTop =
	ui.gridScrollTop = ypx <= 0 ? 0
		: Math.min( ypx, ui.tracks.length * ui.gridEm - ui.gridColsHeight );
	ui.updateGridTopShadow();
};
