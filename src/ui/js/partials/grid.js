"use strict";

ui.gridInit = function() {
	ui._gridScrollTop = 0;
	ui._gridZoom = 1;
};

ui.gridGetWhen = function( px ) {
	var xem = ( px - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm;

	return ( ui.isMagnetized ? common.secRound( xem ) : xem ) / ui.BPMem;
};

ui.gridGetTrackByPageY = function( py ) {
	return waFwk.tracks[
		Math.floor( ( py - ui.gridColsY + ui._gridScrollTop ) / ui.trackHeight ) ];
};

ui.gridScrollTop = function( ypx ) {
	ui.dom.gridCols.scrollTop =
	ui._gridScrollTop = ypx <= 0 ? 0
		: Math.min( ypx, waFwk.tracks.length * ui.gridEm - ui.gridColsHeight );
	ui.updateGridTopShadow();
};

ui.gridZoom = function( zm, xpx ) {
	zm = Math.min( Math.max( 1, zm ), 8 );
	var zmMul = zm / ui._gridZoom;

	ui._gridZoom = zm;
	ui.gridEm *= zmMul;
	ui.dom.gridEm.style.fontSize = zm + "em";
	ui.dom.grid.dataset.sampleSize =
		ui.gridEm < 40 ? "small" :
		ui.gridEm < 80 ? "medium" : "big";
	ui.gridcontentLeft( xpx - ( -ui.trackLinesLeft + xpx ) * zmMul );
	ui.timelineUpdate();
	ui.tracksBgUpdate();
};
