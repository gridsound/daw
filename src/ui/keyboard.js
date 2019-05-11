"use strict";

const UIkeyboardFns = [];

function UIkeyboardInit() {
	UIkeyboardFns.push(
		// ctrlOrAlt, alt, key, fn
		[ true,  false, "o", UIopenPopupShow ],
		[ true,  false, "s", UIcompositionClickSave ],
		[ true,  true,  "n", UIcompositionClickNewLocal ],
		[ true,  false, "z", DOM.undo.onclick ],
		[ true,  false, "Z", DOM.redo.onclick ],
		[ false, false, " ", () => {
			DAW.isPlaying()
				? DOM.stop.onclick()
				: DOM.play.onclick();
		} ],
	);
}

function UIkeyboardUp( e ) {
	UIpianorollKeyboardEvent( false, e );
}

function UIkeyboardDown( e ) {
	if ( !UIkeyboardShortcuts( e ) && !e.ctrlKey && !e.altKey && !e.shiftKey ) {
		UIpianorollKeyboardEvent( true, e );
	}
}

function UIkeyboardShortcuts( e ) {
	return UIkeyboardFns.some( ( [ ctrlOrAlt, alt, key, fn ] ) => {
		if ( ( key === e.key ) &&
			( !alt || e.altKey ) &&
			( ctrlOrAlt === ( e.ctrlKey || e.altKey ) )
		) {
			fn();
			e.preventDefault();
			return true;
		}
	} );
}
