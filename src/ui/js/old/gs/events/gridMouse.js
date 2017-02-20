"use strict";

( function() {

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

ui.dom.gridcontent.oncontextmenu = function() { return false; };
ui.dom.gridcontent.onmousedown = function( e ) {
	if ( !mouseIsDown ) {
		var fn;

		mouseIsDown = true;
		mousedownSec = ui.grid.getWhen( e.pageX );
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		if ( e.button === 2 ) {
			ui.tools.save();
			ui.tools.select( "delete" );
		}
		fn = ui.tool[ ui.currentTool ].mousedown;
		fn && fn( e );
	}
};

document.body.onwheel = function( e ) {
	if ( e.ctrlKey ) {
		return false;
	}
};

document.body.addEventListener( "mousemove", function( e ) {
	if ( mouseIsDown ) {
		var fn = ui.tool[ ui.currentTool ].mousemove,
			secNew = ui.grid.getWhen( e.pageX );

		ui.px_xRel = e.pageX - ui.px_x;
		ui.px_yRel = e.pageY - ui.px_y;
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		if ( fn ) {
			mousedownSec += fn( e, secNew - mousedownSec );
		}
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( mouseIsDown ) {
		var fn = ui.tool[ ui.currentTool ].mouseup;

		fn && fn( e );
		setBackOldTool();
	}
} );

window.addEventListener( "blur", setBackOldTool );

var mouseIsDown,
	mousedownSec;

function setBackOldTool() {
	ui.tools.restore();
	mouseIsDown = false;
}

} )();
