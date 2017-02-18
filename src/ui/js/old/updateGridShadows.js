"use strict";

( function() {

var gradientPx = 2,
	color = "rgba(0,0,0,.3)",
	css = "px " + gradientPx + "px " + color;

ui.updateGridLeftShadow = function() {
	ui.dom.tracksNames.style.boxShadow = !ui.trackLinesLeft ? "none" :
		Math.min( 2 - ui.trackLinesLeft / 8, 5 ) + "px 0" + css;
};

ui.updateGridTopShadow = function() {
	ui.dom.gridHeader.style.boxShadow = !ui._gridScrollTop ? "none" :
		"0px " + Math.min( 2 + ui._gridScrollTop / 8, 5 ) + css;
};

} )();
