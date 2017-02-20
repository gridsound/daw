"use strict";

ui.px_x =
ui.px_y =
ui.px_xRel =
ui.px_yRel = 0;

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

document.body.addEventListener( "mousemove", function( e ) {
	if ( ui.mouseIsDown ) {
		var fn = ui.tool[ ui.currentTool ].mousemove,
			secNew = ui.grid.getWhen( e.pageX );

		ui.px_xRel = e.pageX - ui.px_x;
		ui.px_yRel = e.pageY - ui.px_y;
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		if ( fn ) {
			ui.mousedownSec += fn( e, secNew - ui.mousedownSec );
		}
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( ui.mouseIsDown ) {
		var fn = ui.tool[ ui.currentTool ].mouseup;

		fn && fn( e );
		ui.tools.restore();
		ui.mouseIsDown = false;
	}
} );

window.addEventListener( "blur", function() {
	ui.tools.restore();
	ui.mouseIsDown = false;
} );
