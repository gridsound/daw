"use strict";

( function() {

var gradientPx = 2,
	color = "rgba(0,0,0,.3)",
	css = "px " + gradientPx + "px " + color;

ui.updateGridLeftShadow = function() {
	var x = -ui.trackLinesLeft;
	wisdom.css( ui.elTrackNames, "boxShadow", x
		? Math.min( 2 + x / 8, 5 ) + "px 0" + css
		: "none" );
};

ui.updateGridTopShadow = function() {
	var y = ui.gridScrollTop;
	wisdom.css( ui.elGridHeader, "boxShadow", y
		? "0px " + Math.min( 2 + y / 8, 5 ) + css
		: "none" );
};

} )();
