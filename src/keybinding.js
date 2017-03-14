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

	{ fn: gs.playStop,                keys: [ " " ] },
	{ fn: gs.playPause,               keys: [ "ctrl", " " ] },
	{ fn: ui.btnMagnet.toggle,        keys: [ "g" ] },
	{ fn: gs.samples.selected.copy,   keys: [ "ctrl", "c" ] },
	{ fn: gs.samples.selected.paste,  keys: [ "ctrl", "v" ] },
	{ fn: gs.compositions.saveCurrent, keys: [ "ctrl", "s" ] },

	{ keys: [ "ctrl", "z" ], fn: waFwk.undo },
	{ keys: [ "ctrl", "shift", "z" ], fn: waFwk.redo },
	{ keys: [ "delete" ], fn: function() {
		waFwk.do( "removeSamples", waFwk.selectedSamples.slice() );
	} }
);

var oldTool;

function keyTool( route ) {
	oldTool = ui.currentTool;
	ui.tools.select( route.name );
}

function keyToolCAS( route, e ) {
	if ( e.type === "keydown" ) {
		keyTool( route );
	} else if ( oldTool ) {
		ui.tools.select( oldTool );
		oldTool = null;
	}
};

} )();
