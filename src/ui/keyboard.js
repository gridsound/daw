"use strict";

const UIkeyPressed = new Map();

function UIkeyboardUp( e ) {
	if ( !UIkeyPressed[ e.key ] ) {
		UIpianorollKeyboardEvent( false, e );
	}
	delete UIkeyPressed[ e.key ];
}

function UIkeyboardDown( e ) {
	const key = e.key;
	let prevent;

	if ( key === " " ) {
		prevent = true;
		DAW.isPlaying()
			? DOM.stop.onclick()
			: DOM.play.onclick();
	} else if ( e.ctrlKey || e.altKey ) {
		prevent = true;
		     if ( key === "o" ) { UIopenPopupShow(); }
		else if ( key === "s" ) { UIcompositionClickSave(); }
		else if ( key === "z" ) { DOM.undo.onclick(); }
		else if ( key === "Z" ) { DOM.redo.onclick(); }
		else if ( key === "n" && e.altKey ) { UIcompositionClickNew(); }
		else { prevent = false; }
		UIkeyPressed[ key ] = true;
	} else {
		UIpianorollKeyboardEvent( true, e );
	}
	if ( prevent ) {
		e.preventDefault();
	}
}
