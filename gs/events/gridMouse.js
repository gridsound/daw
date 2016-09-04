"use strict";

( function() {

ui.px_x = ui.px_y =
ui.em_x = ui.em_y =
ui.px_xRel = ui.px_yRel =
ui.em_xRel = ui.em_yRel = 0;

window.addEventListener( "blur", setBackOldTool );

ui.elGridCols.onwheel = function( e ) {
	if ( ui.currentTool === "zoom" ) {
		ui.tool.zoom.wheel( e );
		return false;
	}
};
ui.elGridCols.onscroll = function() {
	ui.gridScrollTop = ui.elGridCols.scrollTop;
	ui.updateGridTopShadow();
};

ui.elTrackLines.oncontextmenu = function() { return false; };
ui.elTrackLines.onmousedown = function( e ) {
	if ( !mouseIsDown ) {
		mouseIsDown = true;
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		ui.em_x = ui.getGridXem( e.pageX );
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
			xemNew = ui.getGridXem( e.pageX );

		ui.px_xRel = e.pageX - ui.px_x;
		ui.px_yRel = e.pageY - ui.px_y;
		ui.em_xRel = xemNew - ui.em_x;
		ui.px_x = e.pageX;
		ui.px_y = e.pageY;
		ui.em_x = xemNew;
		if ( fn ) {
			fn( e );
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

var mouseIsDown, oldTool;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
	mouseIsDown = false;
}

} )();
