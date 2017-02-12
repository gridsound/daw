"use strict";

ui.initElement( "btnUndo", function() {
	return {
		click: gs.history.undo
	};
} );
