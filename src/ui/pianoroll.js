"use strict";

const UIpianoroll = new gsuiPianoroll(),
	UIkeys = UIpianoroll.uiKeys;

function UIpianorollInit() {
	const win = UIwindows.window( "piano" );

	UIpianoroll.octaves( 1, 7 );
	UIpianoroll.setPxPerBeat( 90 );
	UIpianoroll.setFontSize( 20 );
	UIpianoroll.onchange = obj => DAW.changePatternKeys( DAW.get.patternOpened(), obj );
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
	const id = DAW.get.patternOpened(),
		name = DOM.pianorollName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.namePattern( id, name ) );
}

function UIpianorollKeyboardEvent( status, e ) {
	const midi = UIkeys.getMidiKeyFromKeyboard( e );

	if ( midi !== false ) {
		if ( status ) {
			UIkeys.midiKeyDown( midi );
			UIkeys.onkeydown( midi );
		} else {
			UIkeys.midiKeyUp( midi );
			UIkeys.onkeyup( midi );
		}
		return true;
	}
}
