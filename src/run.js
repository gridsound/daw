"use strict";

( function() {

const ctx = new AudioContext();

gs.undoredo = new Undoredo();
gs.undoredo.onchange = ( obj, path, val, previousVal ) => {
	gs.changeComposition( obj );
};

window.wa = {
	ctx,
	render: new waRender(),
	synths: new waSynths(),
	controls: new waControls(),
	mainGrid: new waMainGrid(),
	pianoroll: new waPianoroll(),
	destination: new waDestination( ctx ),
};

uiInit();
gs.init();
gs.loadNewComposition();

} )();
