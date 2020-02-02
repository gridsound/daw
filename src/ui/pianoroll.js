"use strict";

const UIpianoroll = new gsuiPianoroll(),
	UIkeys = UIpianoroll.uiKeys;

function UIpianorollInit() {
	const win = UIwindows.window( "piano" );

	UIpianoroll.octaves( 1, 7 );
	UIpianoroll.setPxPerBeat( 90 );
	UIpianoroll.setFontSize( 20 );
	UIpianoroll.onchange = obj => DAW.callAction( "changePatternKeys", DAW.get.patternKeysOpened(), obj, UIpianoroll.getDuration() );
	UIpianoroll.onchangeLoop = UIpianorollOnChangeLoop;
	UIpianoroll.onchangeCurrentTime = t => DAW.pianoroll.setCurrentTime( t );
	UIpianoroll.rootElement.onfocus = () => DAW.pianorollFocus();
	UIkeys.onkeydown = midi => DAW.pianoroll.liveKeydown( midi );
	UIkeys.onkeyup = midi => DAW.pianoroll.liveKeyup( midi );
	DOM.pianorollName.onclick = UIpianorollNameClick;
	DOM.pianorollForbidden.classList.remove( "hidden" );
	win.onresize =
	win.onresizing = () => UIpianoroll.resized();
	win.onfocusin = UIpianorollWindowFocusin;
	win.append( UIpianoroll.rootElement );
	UIpianoroll.attached();
}

function UIpianorollOnChangeLoop( looping, a, b ) {
	looping
		? DAW.pianoroll.setLoop( a, b )
		: DAW.pianoroll.clearLoop();
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
	const midi = UIkeys.getMidiKeyFromKeyboard( e );

	if ( midi !== false ) {
		status
			? UIkeys.midiKeyDown( midi )
			: UIkeys.midiKeyUp( midi );
		return true;
	}
}
