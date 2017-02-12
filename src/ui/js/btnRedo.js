"use strict";

ui.initElement( "btnRedo", function() {
	return {
		click: gs.history.redo
	};
} );
