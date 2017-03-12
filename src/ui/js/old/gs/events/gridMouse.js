"use strict";

ui.dom.gridCols.onwheel = function( e ) {
	if ( ui.currentTool === "zoom" ) {
		ui.tool.zoom.wheel( e );
		return false;
	}
};

ui.dom.gridCols.onscroll = function() {
	ui.grid._scrollTop = ui.dom.gridCols.scrollTop;
	ui.updateGridTopShadow();
};

document.body.onwheel = function( e ) {
	if ( e.ctrlKey ) {
		return false;
	}
};

window.addEventListener( "blur", function() {
	ui.tools.restore();
	ui.mouseIsDown = false;
} );
