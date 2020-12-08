"use strict";

function UIpianorollInit() {
	const win = UIwindows.window( "piano" );

	DOM.pianorollName.onclick = UIpianorollNameClick;
	DOM.pianorollForbidden.classList.remove( "hidden" );
	win.onfocusin = UIpianorollWindowFocusin;
	win.append( UIpianoroll.rootElement );
	UIpianoroll.setDAWCore( DAW );
	UIpianoroll.rootElement.onfocus = () => DAW.pianorollFocus();
	UIpianoroll.attached();
}

function UIpianorollWindowFocusin( e ) {
	if ( !UIpianoroll.rootElement.contains( e.target ) ) {
		UIpianoroll.rootElement.focus();
	}
}

function UIpianorollNameClick() {
	const id = DAW.get.patternKeysOpened(),
		name = DOM.pianorollName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.callAction( "renamePattern", id, name ) );
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
