"use strict";

gs.undoredo = new Undoredo();
gs.undoredo.onchange = function( obj, path, val, previousVal ) {
	// lg( "onchange", path, val, previousVal );
	gs.changeComposition( obj );
};

ui.init();
wa.init();
gs.init();
gs.loadNewComposition();
