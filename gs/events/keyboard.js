"use strict";

( function() {

window.addEventListener( "blur", setBackOldTool );
document.body.onkeydown = keydown;
document.body.onkeyup = keyup;

function setBackOldTool() {
	if ( oldTool ) {
		ui.selectTool( oldTool );
	}
	CAShold = oldTool = null;
}

function keyup( e ) {
	var k = e.keyCode,
		tool = ui.tool[ ui.currentTool ];

	keysPressed[ k ] = false;
	if ( tool.keyup ) {
		tool.keyup( e );
	}
	if ( k === CAShold ) {
		CAShold = null;
		setBackOldTool();
	}
}

function keydown( e ) {
	var kd, k = e.keyCode;

	if ( !keysPressed[ k ] ) {
		keysPressed[ k ] = true;
		if ( fn[ k ] ) {
			fn[ k ]( e );
			kd = ui.tool[ ui.currentTool ].keydown;
			if ( kd ) {
				kd( e );
			}
		}
	}
	if ( keysBlocked.indexOf( k ) > -1 ) {
		return false;
	}
}

var CAShold,
	oldTool,
	fn = {},
	K_BACKSPACE = 8,
	K_SHIFT = 16,
	K_CTRL = 17,
	K_ALT = 18,
	K_SPACE = 32,
	K_DEL = 46,
	// K_ESCAPE = 27,
	K_B = 66,
	K_C = 67,
	K_D = 68,
	K_G = 71,
	K_H = 72,
	K_M = 77,
	K_S = 83,
	K_V = 86,
	K_Z = 90,
	keysBlocked = [ K_SPACE, K_BACKSPACE, K_ALT ],
	keysPressed = [];

function keyTool( tool ) {
	oldTool = ui.currentTool;
	ui.selectTool( tool );
}

function CASTool( k, tool ) {
	if ( !CAShold ) {
		CAShold = k;
		keyTool( tool );
	}
}

fn[ K_DEL ] = gs.samplesDelete;
fn[ K_G ] = ui.toggleMagnetism;
fn[ K_ALT ] = CASTool.bind( null, K_ALT, "hand" );
fn[ K_CTRL ] = CASTool.bind( null, K_CTRL, "zoom" );
fn[ K_SHIFT ] = CASTool.bind( null, K_SHIFT, "select" );
fn[ K_B ] = keyTool.bind( null, "paint" );
fn[ K_D ] = keyTool.bind( null, "delete" );
fn[ K_M ] = function() {}; // keyTool.bind( null, "mute" );
fn[ K_S ] = keyTool.bind( null, "slip" );
fn[ K_H ] = keyTool.bind( null, "hand" );
fn[ K_Z ] = keyTool.bind( null, "zoom" );

fn[ K_C ] = function( e ) {
	if ( e.ctrlKey ) {
		gs.samplesCopy();
	} else {
		keyTool( "cut" );
	}
};

fn[ K_V ] = function( e ) {
	if ( e.ctrlKey ) {
		gs.samplesPaste();
	} else {
		keyTool( "select" );
	}
};

fn[ K_SPACE ] = function( e ) {
	gs.fileStop();
	if ( e.ctrlKey ) {
		gs.playToggle();
	} else if ( gs.isPlaying ) {
		gs.stop();
	} else {
		gs.play();
	}
};

} )();
