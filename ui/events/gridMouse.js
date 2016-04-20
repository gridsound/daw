"use strict";

(function() {

var
	mouseIsDown,
	oldTool
;

function mousemove( e ) {
	if ( mouseIsDown ) {
		var uisample = e.target.uisample;
		switch ( ui.currentTool ) {
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

ui.jqGrid.on( {
	contextmenu: false,
	mousemove: mousemove,
	mousedown: function( e ) {
		if ( !mouseIsDown ) {
			mouseIsDown = true;
			if ( e.button === 2 ) {
				oldTool = ui.currentTool;
				ui.selectTool( "delete" );
			}
			mousemove( e );
		}
	},
	mouseup: function( e ) {
		if ( e.button === 2 && oldTool ) {
			ui.selectTool( oldTool );
		}
		mouseIsDown = false;
	}
});

})();
