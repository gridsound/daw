"use strict";

(function() {

var
	oldTool,
	mouseIsDown
;

function mousemove( e ) {
	if ( mouseIsDown && ( e = e.target.uisample ) ) {
		ui.deleteSample( e );
	}
}

ui.jqTrackLines.on( {
	contextmenu: false,
	mousemove: mousemove,
	mousedown: function( e ) {
		if ( e.button === 2 || ui.currentTool === "delete" ) {
			if ( ui.currentTool !== "delete" ) {
				oldTool = ui.currentTool;
				ui.selectTool( "delete" );
			}
			mouseIsDown = true;
			mousemove( e );
		}
	}
});

ui.jqBody.mouseup( function() {
	if ( mouseIsDown ) {
		if ( oldTool ) {
			ui.selectTool( oldTool );
			oldTool = null;
		}
		mouseIsDown = false;
	}
});

})();
