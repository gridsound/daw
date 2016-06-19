"use strict";

( function() {

var KEY_BACKSPACE = 8,
	KEY_ENTER = 13,
	KEY_SHIFT = 16,
	KEY_CTRL = 17,
	KEY_SPACE = 32,
	KEY_DEL = 46,
	KEY_B = 66,
	KEY_C = 67,
	KEY_D = 68,
	KEY_G = 71,
	KEY_H = 72,
	KEY_M = 77,
	KEY_S = 83,
	KEY_V = 86,
	KEY_Z = 90,
	oldTool,
	keysPressed = [],
	shortcuts = {}
;

shortcuts[ KEY_B ] = "paint";
shortcuts[ KEY_D ] = "delete";
shortcuts[ KEY_M ] = "mute";
shortcuts[ KEY_S ] = "slip";
shortcuts[ KEY_C ] = "cut";
shortcuts[ KEY_SPACE ] = shortcuts[ KEY_H ] = "hand";
shortcuts[ KEY_SHIFT ] = shortcuts[ KEY_V ] = "select";
shortcuts[ KEY_CTRL ]  = shortcuts[ KEY_Z ] = "zoom";

function shiftCtrlSpace( k ) {
	return k === KEY_SHIFT || k === KEY_CTRL || k === KEY_SPACE;
}

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
}

function keys( e ) {
	switch ( e.keyCode ) {
		case KEY_ENTER:
			gs.playToggle();
		break;
		case KEY_BACKSPACE:
			gs.fileStop();
			gs.stop();
		break;
		case KEY_DEL:
			gs.samplesDelete();
		break;
		case KEY_G:
			ui.toggleMagnetism();
		break;
		case KEY_C:
			if ( e.ctrlKey ) {
				gs.samplesCopy();
			}
		break;
		case KEY_V:
			if ( e.ctrlKey ) {
				gs.samplesPaste();
			}
		break;
		default: return true;
	}
}

ui.jqWindow.blur( setBackOldTool );

ui.jqBody
	.keydown( function( e ) {
		var k = e.keyCode;
		if ( !keysPressed[ k ] ) {
			// lg( "keyCode: " + k );
			keysPressed[ k ] = true;
			if ( keys( e ) ) {
				var tool = shortcuts[ k ];
				if ( tool && tool !== ui.currentTool ) {
					if ( shiftCtrlSpace( k ) ) {
						oldTool = ui.currentTool;
					}
					ui.selectTool( tool );
				}
			}
		}
		if ( k === KEY_SPACE || k === KEY_BACKSPACE ) {
			return false;
		}
	} )
	.keyup( function( e ) {
		keysPressed[ e.keyCode ] = false;
		if ( shiftCtrlSpace( e.keyCode ) ) {
			setBackOldTool();
		}
	} )
;

} )();
