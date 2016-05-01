"use strict";

(function() {

var
	oldTool,
	shortcuts = {
		16: "select", // Shift
		86: "select", // V
		66: "paint",  // B
		68: "delete", // D
		77: "mute",   // M
		83: "slip",   // S
		67: "cut",    // C
		32: "hand",   // Space
		72: "hand",   // H
		17: "zoom",   // Ctrl
		90: "zoom"    // Z
	}
;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
}

ui.jqWindow.blur( setBackOldTool );

ui.jqBody
	.keydown( function( e ) {
		// lg( "keyCode: " + e.keyCode );
		e = e.keyCode;
		var tool = shortcuts[ e ];
		if ( tool && tool !== ui.currentTool ) {
			if ( e === 16 || e === 17 || e === 32 ) {
				oldTool = ui.currentTool;
			}
			ui.selectTool( tool );
		}
	})
	.keyup( function( e ) {
		e = e.keyCode;
		if ( e === 16 || e === 17 || e === 32 ) {
			setBackOldTool();
		}
	})
;

})();
