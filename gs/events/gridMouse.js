"use strict";

( function() {

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

ui.jqWindow.blur( setBackOldTool );

ui.jqGridCols.on( {
	wheel: function( e ) {
		if ( ui.currentTool === "zoom" ) {
			ui.tool.zoom.wheel( e.originalEvent );
			return false;
		}
	},
	scroll: function() {
		ui.gridScrollTop = ui.jqGridCols[ 0 ].scrollTop;
		ui.updateGridTopShadow();
	}
} );

ui.jqTrackLines.on( {
	contextmenu: false,
	mousedown: function( e ) {
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
	}
} );

ui.jqBody.on( {
	wheel: function( e ) {
		if ( e.ctrlKey ) {
			return false;
		}
	},
	mousemove: function( e ) {
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
	},
	mouseup: function( e ) {
		if ( mouseIsDown ) {
			var fn = ui.tool[ ui.currentTool ].mouseup;
			if ( fn ) {
				fn( e, e.target.gsSample );
			}
			setBackOldTool();
		}
	}
} );

} )();
