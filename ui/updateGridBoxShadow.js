"use strict";

ui.updateGridBoxShadow = function() {
	function shadow( x, y ) {
		if ( x = x || y ) {
			x = Math.min( 2 - x / 8, 5 );
			return ( y ? "0px " + x : x + "px 0" ) + "px 2px rgba(0,0,0,.3)";
		}
		return "none";
	}
	ui.jqGridHeader.css( "boxShadow", shadow( 0, ui.gridTop ) );
	ui.jqTrackNames.css( "boxShadow", shadow( ui.trackLinesLeft, 0 ) );
};
