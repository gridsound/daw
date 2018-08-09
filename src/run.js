"use strict";

( function() {

const ctx = new AudioContext(),
	cookies = document.cookie,
	hash = location.hash.substr( 1 ).split( "&" )
		.reduce( ( obj, kv ) => {
			const arr = kv.split( "=" );

			obj[ arr[ 0 ] ] = arr[ 1 ];
			return obj;
		}, {} );

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
	renderPopup: new uiRenderPopup(),
	settingsPopup: new uiSettingsPopup(),
	shortcutsPopup: new uiShortcutsPopup(),
};
uiWindowEvents();
window.onresize();

// Delete all the cookies if it's not only accepted.
if ( cookies && cookies !== "cookieAccepted" ) {
	cookies.split( ";" ).forEach( c => {
		const eq = c.indexOf( "=" );

		document.cookie = ( eq < 0 ? c : c.substr( 0, eq ) )
			+ "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	} );
}

gs.init();

if ( hash.cmp ) {
	location.hash = "";
	gs.loadCompositionByURL( hash.cmp ).catch( e => {
		console.warn( e );
		gs.loadNewComposition();
	} );
} else {
	gs.loadNewComposition();
}

} )();
