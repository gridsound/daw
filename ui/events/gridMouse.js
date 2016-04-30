"use strict";

(function() {

var
	mouseIsDown,
	oldTool,
	px = 0, py = 0
;

function mousemove( e ) {
	if ( mouseIsDown ) {
		var
			sample = e.target.uisample,
			mx = e.pageX - px,
			my = e.pageY - py
		;
		px = e.pageX;
		py = e.pageY;

		// Tools:
		switch ( ui.currentTool ) {
			case "hand":
				ui.setTrackLinesLeft( ui.trackLinesLeft + mx );
				ui.setGridTop( ui.gridTop + my );
				ui.updateTimeline();
				ui.updateGridBoxShadow();
			break;
			case "delete":
				ui.sampleDelete( sample );
			break;
			case "mute":
				if ( sample ) {
					sample.mute();
				}
			break;
			case "slip":
				if ( sample ) {
					ui.samplesSlip( sample, mx / ui.gridEm );
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

			// Special cases:
			if ( e.button === 0 ) {
				if ( ui.currentTool === "hand" ) {
					ui.jqBody.addClass( "cursor-move" );
				}
			} else if ( e.button === 2 ) {
				oldTool = ui.currentTool;
				ui.selectTool( "delete" );
			}

			// Sample selection:
			if ( ui.currentTool === "paint" ) {
				var sample = e.target.uisample;
				if ( !e.shiftKey ) {
					ui.samplesUnselect();
				}
				if ( sample ) {
					ui.sampleSelect( sample, !sample.selected );
				}
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
