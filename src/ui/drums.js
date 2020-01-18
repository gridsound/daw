"use strict";

const UIdrums = new gsuiDrums();
	// UIkeys = UIdrums.uiKeys;

function UIdrumsInit() {
	const win = UIwindows.window( "drums" );

	UIdrums.setFontSize( 42 );
	UIdrums.setPxPerBeat( 120 );
	// UIdrums.onchange = obj => DAW.changePatternKeys( DAW.get.patternKeysOpened(), obj );
	// UIdrums.onchangeLoop = UIdrumsOnChangeLoop;
	// UIdrums.onchangeCurrentTime = t => DAW.drum.setCurrentTime( t );
	// UIdrums.rootElement.onfocus = () => DAW.drumFocus();
	// UIkeys.onkeydown = midi => DAW.drum.liveKeydown( midi );
	// UIkeys.onkeyup = midi => DAW.drum.liveKeyup( midi );
	DOM.drumsName.onclick = UIdrumsNameClick;
	DOM.drumsForbidden.classList.remove( "hidden" );
	win.onresize =
	win.onresizing = ( w, h ) => UIdrums.resize( w, h );
	win.onfocusin = UIdrumsWindowFocusin;
	win.append( UIdrums.rootElement );
	UIdrums.attached();
}

function UIdrumsOnChangeLoop( looping, a, b ) {
	looping
		? DAW.drum.setLoop( a, b )
		: DAW.drum.clearLoop();
}

function UIdrumsWindowFocusin( e ) {
	if ( !UIdrums.rootElement.contains( e.target ) ) {
		UIdrums.rootElement.focus();
	}
}

function UIdrumsNameClick() {
	const id = DAW.get.patternKeysOpened(),
		name = DOM.drumsName.textContent;

	gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
		.then( name => DAW.namePattern( id, name ) );
}

function UIdrumsKeyboardEvent( status, e ) {
	const midi = UIkeys.getMidiKeyFromKeyboard( e );

	if ( midi !== false ) {
		status
			? UIkeys.midiKeyDown( midi )
			: UIkeys.midiKeyUp( midi );
		return true;
	}
}
