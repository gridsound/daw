"use strict";

(function() {

var
	mouseIsDown,
	oldTool,
	px = 0, py = 0
;

function mousemove( e ) {
	if ( mouseIsDown ) {
		var uisample = e.target.uisample;
		switch ( ui.currentTool ) {
			case "hand":
				ui.setTrackLinesLeft( ui.trackLinesLeft + ( e.pageX - px ) );
				ui.setGridTop( ui.gridTop + ( e.pageY - py ) );
				ui.updateTimeline();
				ui.updateGridBoxShadow();
				px = e.pageX;
				py = e.pageY;
			break;
			case "delete":
				ui.deleteSample( uisample );
			break;
			case "mute":
				if ( uisample ) {
					uisample.mute();
				}
			break;
		}
	}
}

ui.jqTrackLines.on( {
	contextmenu: false,
	mousedown: function( e ) {
		if ( !mouseIsDown ) {
			mouseIsDown = true;
			px = e.pageX;
			py = e.pageY;
			if ( e.button === 0 ) {
				if ( ui.currentTool === "hand" ) {
					ui.jqBody.addClass( "cursor-move" );
				}
			} else if ( e.button === 2 ) {
				oldTool = ui.currentTool;
				ui.selectTool( "delete" );
			}
			mousemove( e );
		}
	}
});

ui.jqBody.on( {
	mousemove: mousemove,
	mouseup: function( e ) {
		if ( e.button === 2 && oldTool ) {
			ui.selectTool( oldTool );
		}
		ui.jqBody.removeClass( "cursor-move" );
		mouseIsDown = false;
	}
});

})();
