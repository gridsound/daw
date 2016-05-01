"use strict";

(function() {

var
	mouseIsDown,
	oldTool
;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
	mouseIsDown = false;
}

ui.jqWindow.blur( setBackOldTool );

ui.jqBody.on( {
	mousemove: function( e ) {
		if ( mouseIsDown ) {
			ui.tool[ ui.currentTool ].mousemove( e, e.target.uisample );
		}
	},
	mouseup: function( e ) {
		if ( mouseIsDown ) {
			ui.tool[ ui.currentTool ].mouseup( e, e.target.uisample );
			setBackOldTool();
		}
	}
});

ui.jqTrackLines.on( {
	contextmenu: false,
	mousedown: function( e ) {
		if ( !mouseIsDown ) {
			mouseIsDown = true;
			if ( e.button === 0 ) {
				if ( ui.currentTool === "hand" ) {
					ui.jqBody.addClass( "cursor-move" );
				}
			} else if ( e.button === 2 ) {
				oldTool = ui.currentTool;
				ui.selectTool( "delete" );
			}
			ui.tool[ ui.currentTool ].mousedown( e, e.target.uisample );
		}
	}
});

})();
