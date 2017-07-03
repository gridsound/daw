"use strict";

ui.windowEvents = function() {
	window.onresize = function() {
		ui.panelsMain.resized();
	};

	window.onbeforeunload = function() {
		if ( !gs.currCmpSaved && gs.history.length ) {
			return "Data unsaved";
		}
	};

	window.onkeydown = function( e ) {
		if ( e.ctrlKey ) {
			switch ( e.code ) {
				case "KeyS":
					gs.saveCurrentComposition();
					break;
				case "KeyZ":
					e.shiftKey ? gs.redo() : gs.undo();
					break;
				default:
					return;
			}
			e.preventDefault();
		}
	};

	document.body.onclick = function( e ) {
		ui.cmps._hideMenu();
	};
};
