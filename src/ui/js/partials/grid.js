"use strict";

ui.grid = {
	init: function() {
	},
	getWhen: function( px ) {
		var xem = ( px - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm;

		return ( ui.isMagnetized ? common.secRound( xem ) : xem ) / ui.BPMem;
	},
	getTrackByPageY: function( py ) {
		return waFwk.tracks[
			Math.floor( ( py - ui.gridColsY + ui.grid._scrollTop ) / ui.trackHeight ) ];
	},
	scrollTop: function( ypx ) {
		ui.dom.gridCols.scrollTop =
		ui.grid._scrollTop = ypx <= 0 ? 0
			: Math.min( ypx, waFwk.tracks.length * ui.gridEm - ui.gridColsHeight );
		ui.updateGridTopShadow();
	},
	zoom: function( zm, xpx ) {
		zm = Math.min( Math.max( 1, zm ), 8 );

		var zmMul = zm / ui.grid._zoom;

		ui.grid._zoom = zm;
		ui.gridEm *= zmMul;
		ui.dom.gridEm.style.fontSize = zm + "em";
		ui.dom.grid.dataset.sampleSize =
			ui.gridEm < 40 ? "small" :
			ui.gridEm < 80 ? "medium" : "big";
		ui.gridcontent.left( xpx - ( -ui.trackLinesLeft + xpx ) * zmMul );
		ui.timeline.update();
		ui.tracksBg.update();
	},

	// private:
	_scrollTop: 0,
	_zoom: 1
};
