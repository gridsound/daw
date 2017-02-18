"use strict";

( function() {

ui.px_x =
ui.px_y =
ui.px_xRel =
ui.px_yRel = 0;

window.addEventListener( "blur", setBackOldTool );

ui.dom.gridCols.onwheel = function( e ) {
	if ( ui.currentTool === "zoom" ) {
		ui.tool.zoom.wheel( e );
		return false;
	}
};
ui.dom.gridCols.onscroll = function() {
	ui._gridScrollTop = ui.dom.gridCols.scrollTop;
	ui.updateGridTopShadow();
};

ui.dom.tracksLines.oncontextmenu = function() { return false; };
ui.dom.tracksLines.onmousedown = function( e ) {
	if ( !mouseIsDown ) {
		mouseIsDown = true;
		mousedownSec = ui.gridGetWhen( e.pageX );
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		if ( e.button === 2 ) {
			oldTool = ui.currentTool;
			ui.selectTool( "delete" );
		}
		var fn = ui.tool[ ui.currentTool ].mousedown;
		if ( fn ) {
			fn( e );
		}
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
			secNew = ui.gridGetWhen( e.pageX );

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

		if ( fn ) {
			fn( e );
		}
		setBackOldTool();
	}
} );

var mouseIsDown,
	mousedownSec,
	oldTool;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
	mouseIsDown = false;
}

} )();
