"use strict";

( function() {

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
		xemSave = ui.getGridXem( e.pageX );
		px = e.pageX;
		py = e.pageY;
		if ( e.button === 2 ) {
			oldTool = ui.currentTool;
			ui.selectTool( "delete" );
		}
		var fn = ui.tool[ ui.currentTool ].mousedown;
		if ( fn ) {
			fn( e, e.target.gsSample );
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
			newXem = ui.getGridXem( e.pageX );
		if ( fn ) {
			fn( e, e.target.gsSample,
				ui.currentTool !== "hand"
					? ( newXem - xemSave ) * ui.gridEm
					: e.pageX - px,
				e.pageY - py
			);
		}
		xemSave = newXem;
		px = e.pageX;
		py = e.pageY;
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( mouseIsDown ) {
		var fn = ui.tool[ ui.currentTool ].mouseup;
		if ( fn ) {
			fn( e, e.target.gsSample );
		}
		setBackOldTool();
	}
} );

var mouseIsDown,
	oldTool,
	xemSave,
	px = 0, py = 0;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
	mouseIsDown = false;
}

} )();
