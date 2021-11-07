"use strict";

function UIpianorollInit() {
	const win = UIwindows.window( "piano" );

	DOM.pianorollName.onclick = UIpianorollNameClick;
	win.onfocusin = UIpianorollWindowFocusin;
	win.contentAppend( UIpianoroll.rootElement );
	UIpianoroll.setDAWCore( DAW );
	UIpianoroll.rootElement.onfocus = () => DAW.focusOn( "keys" );
	UIpianoroll.rootElement.octaves( 1, 7 );
}

function UIpianorollWindowFocusin( e ) {
	if ( !UIpianoroll.rootElement.contains( e.target ) ) {
		UIpianoroll.rootElement.focus();
	}
}

function UIpianorollNameClick() {
	const id = DAW.get.patternKeysOpened(),
		name = DOM.pianorollName.textContent;

	if ( id ) {
		GSUI.popup.prompt( "Rename pattern", "", name, "Rename" )
			.then( name => DAW.callAction( "renamePattern", id, name ) );
	}
}

function UIpianorollKeyboardEvent( status, e ) {
	const uiKeys = UIpianoroll.getUIKeys(),
		midi = uiKeys.getMidiKeyFromKeyboard( e );

	if ( midi !== false ) {
		status
			? uiKeys.midiKeyDown( midi )
			: uiKeys.midiKeyUp( midi );
		return true;
	}
}
