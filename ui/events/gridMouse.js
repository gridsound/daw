"use strict";

(function() {

var
	mouseIsDown,
	oldTool,
	xemSave,
	px = 0, py = 0
;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
	mouseIsDown = false;
}

ui.jqWindow.blur( setBackOldTool );

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
				fn( e, e.target.uisample );
			}
		}
	}
});

ui.jqGrid.on( "wheel", function( e ) {
	e = e.originalEvent;
	if ( ui.currentTool === "zoom" ) {
		ui.tool.zoom.wheel( e );
	} else {
		// Vertical scroll:
		ui.setGridTop( ui.gridTop + ( e.deltaY < 0 ? .9 : -.9 ) * ui.gridEm );
	}
	ui.updateGridBoxShadow();
});

ui.jqBody.on( {
	mousemove: function( e ) {
		if ( mouseIsDown ) {
			var fn = ui.tool[ ui.currentTool ].mousemove,
				newXem = ui.getGridXem( e.pageX );
			if ( fn ) {
				fn( e, e.target.uisample,
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
				fn( e, e.target.uisample );
			}
			setBackOldTool();
		}
	},
	wheel: function( e ) {
		if ( e.ctrlKey ) {
			return false;
		}
	}
});

})();
