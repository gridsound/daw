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
window.ui = {
	cmps: new uiCmps(),
	history: new uiHistory(),
	synths: new uiSynths(),
	patterns: new uiPatterns(),
	controls: new uiControls(),
	mainGrid: new uiMainGrid(),
	synth: new uiSynth(),
	pattern: new uiPattern(),
	openPopup: new uiOpenPopup(),
	aboutPopup: new uiAboutPopup(),
	settingsPopup: new uiSettingsPopup(),
	shortcutsPopup: new uiShortcutsPopup(),
};
uiWindowEvents();
window.onresize();

gs.init();
gs.loadNewComposition();

} )();
