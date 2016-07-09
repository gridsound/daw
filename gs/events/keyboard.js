"use strict";

( function() {

ui.jqWindow.blur( setBackOldTool );
ui.jqBody.keydown( keydown ).keyup( keyup );

var KEY_BACKSPACE = 8,
	KEY_SHIFT = 16,
	KEY_CTRL = 17,
	KEY_ALT = 18,
	KEY_SPACE = 32,
	KEY_DEL = 46,
	KEY_ESCAPE = 27,
	KEY_B = 66,
	KEY_C = 67,
	KEY_D = 68,
	KEY_G = 71,
	KEY_H = 72,
	KEY_M = 77,
	KEY_S = 83,
	KEY_V = 86,
	KEY_Z = 90,
	CLSholded,
	oldTool,
	keysPressed = [],
	shortcuts = {};

shortcuts[ KEY_B ] = "paint";
shortcuts[ KEY_D ] = "delete";
shortcuts[ KEY_M ] = "mute";
shortcuts[ KEY_S ] = "slip";
shortcuts[ KEY_C ] = "cut";
shortcuts[ KEY_ALT ] = shortcuts[ KEY_H ] = "hand";
shortcuts[ KEY_SHIFT ] = shortcuts[ KEY_V ] = "select";
shortcuts[ KEY_CTRL ]  = shortcuts[ KEY_Z ] = "zoom";

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
}

function keys( e ) {
	switch ( e.keyCode ) {
		case KEY_ESCAPE:
			if ( ui.jqAbout.hasClass( "show" ) ) {
				ui.toggleAbout( false );
				location.hash = "";
			}
		break;
		case KEY_SPACE:
			if ( e.ctrlKey ) {
				gs.playToggle();
			} else if ( gs.isPlaying ) {
				gs.stop();
			} else {
				gs.play();
			}
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

function keyup( e ) {
	var k = e.keyCode;
	keysPressed[ k ] = false;
	if ( k === CLSholded ) {
		CLSholded = null;
		setBackOldTool();
	}
}

function keydown( e ) {
	var tool, cls, k = e.keyCode;
	if ( !keysPressed[ k ] ) {
		keysPressed[ k ] = true;
		if ( keys( e ) ) {
			tool = shortcuts[ k ];
			if ( tool && tool !== ui.currentTool ) {
				cls = k === KEY_CTRL || k === KEY_ALT || k === KEY_SHIFT;
				if ( !cls || !CLSholded ) {
					if ( cls ) {
						CLSholded = k;
						oldTool = ui.currentTool;
					}
					ui.selectTool( tool );
				}
			}
		}
	}
	if ( k === KEY_SPACE || k === KEY_BACKSPACE || k === KEY_ALT ) {
		return false;
	}
}

} )();
