"use strict";

const UIpianoroll = new gsuiPianoroll();

function UIpianorollInit() {
	const pia = UIpianoroll;

	pia.octaves( 1, 7 );
	pia.setPxPerBeat( 90 );
	pia.setFontSize( 20 );
	pia.onchange = obj => DAW.changePatternKeys( DAW.get.patternOpened(), obj );
	pia.onchangeLoop = ( looping, a, b ) => looping
		? DAW.pianoroll.setLoop( a, b )
		: DAW.pianoroll.clearLoop();
	pia.onchangeCurrentTime = t => DAW.pianoroll.setCurrentTime( t );
	pia.rootElement.onfocus = () => DAW.pianorollFocus();
	pia.uiKeys.onkeydown = midi => DAW.pianoroll.liveKeydown( midi );
	pia.uiKeys.onkeyup = midi => DAW.pianoroll.liveKeyup( midi );
	DOM.pianorollName.onclick = () => {
		const id = DAW.get.patternOpened(),
			name = DOM.pianorollName.textContent;

		gsuiPopup.prompt( "Rename pattern", "", name, "Rename" )
			.then( name => DAW.namePattern( id, name ) );
	};
	DOM.pianorollBlock.classList.add( "show" );
	DOM.keysGridWrap.append( pia.rootElement );
	pia.attached();
}

function UIpianorollKeyboardEvent( status, e ) {
	const uiKeys = UIpianoroll.uiKeys,
		midi = uiKeys.getMidiKeyFromKeyboard( e );

	if ( midi ) {
		if ( status ) {
			uiKeys.midiKeyDown( midi );
			uiKeys.onkeydown( midi );
		} else {
			uiKeys.midiKeyUp( midi );
			uiKeys.onkeyup( midi );
		}
		return true;
	}
}
