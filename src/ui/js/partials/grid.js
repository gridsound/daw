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
		ui.grid.updateTopShadow();
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
	updateLeftShadow: function() {
		ui.dom.tracksNames.style.boxShadow = !ui.trackLinesLeft ? "none" :
			Math.min( 2 - ui.trackLinesLeft / 8, 5 ) + "px 0" + "px 2px rgba(0,0,0,.3)";
	},
	updateTopShadow: function() {
		ui.dom.gridHeader.style.boxShadow = !ui.grid._scrollTop ? "none" :
			"0px " + Math.min( 2 + ui.grid._scrollTop / 8, 5 ) + "px 2px rgba(0,0,0,.3)";
	},

	// private:
	_scrollTop: 0,
	_zoom: 1
};
