"use strict";

( function() {

keyboardRouter(
	{ fn: keyToolCAS, when: "down,up", keys: [ "alt" ],   name: "hand" },
	{ fn: keyToolCAS, when: "down,up", keys: [ "ctrl" ],  name: "zoom" },
	{ fn: keyToolCAS, when: "down,up", keys: [ "shift" ], name: "select" },
	{ fn: keyTool, keys: [ "z" ], name: "zoom" },
	{ fn: keyTool, keys: [ "s" ], name: "slip" },
	{ fn: keyTool, keys: [ "d" ], name: "delete" },
	{ fn: keyTool, keys: [ "c" ], name: "cut" },
	{ fn: keyTool, keys: [ "v" ], name: "select" },
	{ fn: keyTool, keys: [ "b" ], name: "paint" },
	{ fn: keyTool, keys: [ "h" ], name: "hand" },

	{ fn: gs.playStop,        keys: [ " " ] },
	{ fn: gs.playPause,       keys: [ "ctrl", " " ] },
	{ fn: gs.samplesDelete,   keys: [ "delete" ] },
	{ fn: ui.toggleMagnetism, keys: [ "g" ] },
	{ fn: gs.samplesCopy,     keys: [ "ctrl", "c" ] },
	{ fn: gs.samplesPaste,    keys: [ "ctrl", "v" ] },
	{ fn: gs.history.undo,    keys: [ "ctrl", "z" ] },
	{ fn: gs.history.redo,    keys: [ "ctrl", "shift", "z" ] }
);

var oldTool;

function keyTool( route ) {
	oldTool = ui.currentTool;
	ui.selectTool( route.name );
}

function keyToolCAS( route, e ) {
	if ( e.type === "keydown" ) {
		keyTool( route );
	} else if ( oldTool ) {
		ui.selectTool( oldTool );
		oldTool = null;
	}
};

} )();
