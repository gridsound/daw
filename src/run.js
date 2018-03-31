"use strict";

gs.undoredo = new Undoredo();
gs.undoredo.onchange = function( obj, path, val, previousVal ) {
	// lg( "onchange", path, val, previousVal );
	gs.changeComposition( obj );
};

wa.ctx = new AudioContext();
wa.destination.init( wa.ctx );
wa.synths.init();
wa.controls.init();
wa.maingrid.init();
wa.pianoroll.init();

ui.init();
gs.init();
gs.loadNewComposition();
